<?php
declare(strict_types=1);

// ARAD Terminal API for cPanel.
// Diagnostics only: this endpoint never executes arbitrary shell input.

const ALLOWED_ORIGIN = 'https://aradzabeti.github.io';
const MAX_REQUESTS = 45;
const WINDOW_SECONDS = 60;
const MAX_BODY_BYTES = 2048;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === ALLOWED_ORIGIN) {
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type, X-ARAD-TERMINAL-KEY');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Max-Age: 600');
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($origin !== '' && $origin !== ALLOWED_ORIGIN) {
    respond(['ok' => false, 'error' => 'origin_not_allowed'], 403);
}

$configFile = __DIR__ . '/terminal-config.php';
if (is_file($configFile)) {
    require_once $configFile;
}
$requiredKey = defined('ARAD_TERMINAL_KEY') ? (string) ARAD_TERMINAL_KEY : '';
$providedKey = (string) ($_SERVER['HTTP_X_ARAD_TERMINAL_KEY'] ?? '');
$keyProtected = $requiredKey !== '';
if ($keyProtected && ($providedKey === '' || !hash_equals($requiredKey, $providedKey))) {
    respond(['ok' => false, 'error' => 'unauthorized'], 401);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'arad_terminal_' . hash('sha256', $ip) . '.json';
$now = time();
$rate = ['start' => $now, 'count' => 0];
if (is_file($rateFile)) {
    $raw = @file_get_contents($rateFile);
    $saved = is_string($raw) ? json_decode($raw, true) : null;
    if (is_array($saved) && isset($saved['start'], $saved['count'])) {
        $rate = ['start' => (int) $saved['start'], 'count' => (int) $saved['count']];
    }
}
if (($now - $rate['start']) >= WINDOW_SECONDS) {
    $rate = ['start' => $now, 'count' => 0];
}
$rate['count']++;
@file_put_contents($rateFile, json_encode($rate), LOCK_EX);
if ($rate['count'] > MAX_REQUESTS) {
    respond(['ok' => false, 'error' => 'rate_limited'], 429);
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$body = '';
if ($requestMethod === 'POST') {
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > MAX_BODY_BYTES) {
        respond(['ok' => false, 'error' => 'request_too_large'], 413);
    }
    $body = file_get_contents('php://input') ?: '';
}
$data = json_decode($body ?: '{}', true);
$data = is_array($data) ? $data : [];
$command = strtolower(trim((string) ($data['command'] ?? ($_GET['command'] ?? 'server'))));

$publicCommands = ['server', 'php', 'os', 'disk', 'health', 'runtime', 'capabilities', 'security', 'web', 'status'];
$privateCommands = ['user', 'cwd'];

if ($requestMethod === 'GET' && !in_array($command, ['health', 'status'], true)) {
    respond(['ok' => false, 'error' => 'get_not_allowed', 'hint' => 'Use POST from the browser terminal.'], 405);
}
if (!in_array($command, array_merge($publicCommands, $privateCommands), true)) {
    respond(['ok' => false, 'error' => 'command_not_allowed', 'allowed' => array_merge($publicCommands, $privateCommands)], 400);
}
if (in_array($command, $privateCommands, true) && !$keyProtected) {
    respond(['ok' => false, 'error' => 'private_key_required', 'hint' => 'Create terminal-config.php on cPanel and configure the terminal key.'], 403);
}

$disk = static function (): array {
    $total = @disk_total_space(__DIR__);
    $free = @disk_free_space(__DIR__);
    $used = ($total && $free !== false) ? round((1 - ($free / $total)) * 100, 1) : null;
    return ['total_bytes' => $total ?: null, 'free_bytes' => $free !== false ? $free : null, 'used_percent' => $used];
};

$runtime = [
    'memory_limit' => ini_get('memory_limit') ?: null,
    'max_execution_time' => ini_get('max_execution_time') ?: null,
    'upload_max_filesize' => ini_get('upload_max_filesize') ?: null,
    'post_max_size' => ini_get('post_max_size') ?: null,
    'timezone' => date_default_timezone_get(),
    'sapi' => PHP_SAPI,
];

switch ($command) {
    case 'server':
        $d = $disk();
        respond(['ok' => true, 'command' => $command, 'data' => [
            'status' => 'ONLINE',
            'php' => PHP_VERSION,
            'sapi' => PHP_SAPI,
            'os' => PHP_OS_FAMILY,
            'kernel' => php_uname('s'),
            'web_server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
            'https' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'host' => $_SERVER['HTTP_HOST'] ?? null,
            'time' => date(DATE_ATOM),
            'disk' => $d,
            'api_version' => '1.1.0',
        ]]);

    case 'php':
        respond(['ok' => true, 'command' => $command, 'data' => [
            'version' => PHP_VERSION,
            'sapi' => PHP_SAPI,
            'zend_version' => zend_version(),
        ]]);

    case 'os':
        respond(['ok' => true, 'command' => $command, 'data' => [
            'family' => PHP_OS_FAMILY,
            'system' => php_uname('s'),
            'release' => php_uname('r'),
            'machine' => php_uname('m'),
        ]]);

    case 'disk':
        respond(['ok' => true, 'command' => $command, 'data' => $disk()]);

    case 'health':
        $checks = [
            'json' => function_exists('json_encode'),
            'openssl' => extension_loaded('openssl'),
            'curl' => extension_loaded('curl'),
            'mbstring' => extension_loaded('mbstring'),
            'pdo' => extension_loaded('PDO'),
            'session' => function_exists('session_status'),
            'api_directory_readable' => is_readable(__DIR__),
            'api_directory_writable' => is_writable(__DIR__),
        ];
        $passed = count(array_filter($checks));
        $totalChecks = count($checks);
        respond(['ok' => true, 'command' => $command, 'data' => [
            'status' => $passed === $totalChecks ? 'HEALTHY' : 'DEGRADED',
            'checks_passed' => $passed,
            'checks_total' => $totalChecks,
            'checks' => $checks,
            'timestamp' => date(DATE_ATOM),
        ]]);

    case 'runtime':
        respond(['ok' => true, 'command' => $command, 'data' => $runtime]);

    case 'capabilities':
        $capabilities = [
            'curl' => extension_loaded('curl'),
            'openssl' => extension_loaded('openssl'),
            'mbstring' => extension_loaded('mbstring'),
            'pdo' => extension_loaded('PDO'),
            'pdo_mysql' => extension_loaded('pdo_mysql'),
            'pdo_sqlite' => extension_loaded('pdo_sqlite'),
            'zip' => extension_loaded('zip'),
            'gd' => extension_loaded('gd'),
            'imagick' => extension_loaded('imagick'),
            'intl' => extension_loaded('intl'),
        ];
        respond(['ok' => true, 'command' => $command, 'data' => $capabilities]);

    case 'security':
        respond(['ok' => true, 'command' => $command, 'data' => [
            'https' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'origin_locked' => $origin !== '' ? $origin === ALLOWED_ORIGIN : null,
            'private_key_enabled' => $keyProtected,
            'rate_limit' => MAX_REQUESTS . ' requests / ' . WINDOW_SECONDS . 's / IP',
            'arbitrary_shell' => false,
            'api_version' => '1.1.0',
        ]]);

    case 'web':
        respond(['ok' => true, 'command' => $command, 'data' => [
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
            'protocol' => $_SERVER['SERVER_PROTOCOL'] ?? 'unknown',
            'https' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'host' => $_SERVER['HTTP_HOST'] ?? null,
            'request_time' => isset($_SERVER['REQUEST_TIME_FLOAT']) ? (float) $_SERVER['REQUEST_TIME_FLOAT'] : null,
        ]]);

    case 'status':
        $d = $disk();
        $healthChecks = [
            function_exists('json_encode'),
            extension_loaded('openssl'),
            is_readable(__DIR__),
            is_writable(__DIR__),
        ];
        respond(['ok' => true, 'command' => $command, 'data' => [
            'status' => 'ONLINE',
            'health' => count(array_filter($healthChecks)) === count($healthChecks) ? 'HEALTHY' : 'CHECK',
            'php' => PHP_VERSION,
            'https' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'disk_used_percent' => $d['used_percent'],
            'private_key_enabled' => $keyProtected,
            'api_version' => '1.1.0',
            'time' => date(DATE_ATOM),
        ]]);

    case 'user':
        respond(['ok' => true, 'command' => $command, 'data' => [
            'php_user' => get_current_user(),
            'server_user' => $_SERVER['REMOTE_USER'] ?? null,
        ]]);

    case 'cwd':
        respond(['ok' => true, 'command' => $command, 'data' => [
            'cwd' => getcwd() ?: __DIR__,
        ]]);
}

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
