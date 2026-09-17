<?php
declare(strict_types=1);

// ARAD Terminal API for cPanel.
// This endpoint exposes diagnostic information only; it never executes arbitrary user input.

const ALLOWED_ORIGIN = 'https://aradzabeti.github.io';
const MAX_REQUESTS = 30;
const WINDOW_SECONDS = 60;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === ALLOWED_ORIGIN) {
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type, X-ARAD-TERMINAL-KEY');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($origin !== '' && $origin !== ALLOWED_ORIGIN) {
    respond(['ok' => false, 'error' => 'origin_not_allowed'], 403);
}

// Optional private key. Keep it OUT of the public repository by creating terminal-config.php on cPanel:
// <?php const ARAD_TERMINAL_KEY = 'your-private-key';
$configFile = __DIR__ . '/terminal-config.php';
if (is_file($configFile)) {
    require_once $configFile;
}
$requiredKey = defined('ARAD_TERMINAL_KEY') ? (string) ARAD_TERMINAL_KEY : '';
if ($requiredKey !== '') {
    $providedKey = (string)($_SERVER['HTTP_X_ARAD_TERMINAL_KEY'] ?? '');
    if ($providedKey === '' || !hash_equals($requiredKey, $providedKey)) {
        respond(['ok' => false, 'error' => 'unauthorized'], 401);
    }
}

// Lightweight IP rate limit using the system temp directory.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'arad_terminal_' . hash('sha256', $ip) . '.json';
$now = time();
$rate = ['start' => $now, 'count' => 0];
if (is_file($rateFile)) {
    $raw = @file_get_contents($rateFile);
    $saved = is_string($raw) ? json_decode($raw, true) : null;
    if (is_array($saved) && isset($saved['start'], $saved['count'])) {
        $rate = ['start' => (int)$saved['start'], 'count' => (int)$saved['count']];
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

$body = file_get_contents('php://input');
$data = json_decode($body ?: '{}', true);
$command = strtolower(trim((string)($data['command'] ?? 'server')));

switch ($command) {
    case 'server':
        $total = @disk_total_space(__DIR__);
        $free = @disk_free_space(__DIR__);
        $usedPercent = ($total && $free !== false) ? round((1 - ($free / $total)) * 100, 1) : null;
        respond([
            'ok' => true,
            'command' => 'server',
            'data' => [
                'status' => 'ONLINE',
                'php' => PHP_VERSION,
                'sapi' => PHP_SAPI,
                'os' => PHP_OS_FAMILY,
                'kernel' => php_uname('s'),
                'web_server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
                'time' => date(DATE_ATOM),
                'disk_used_percent' => $usedPercent,
            ],
        ]);
        break;

    case 'php':
        respond([
            'ok' => true,
            'command' => 'php',
            'data' => [
                'version' => PHP_VERSION,
                'sapi' => PHP_SAPI,
                'extensions' => array_values(get_loaded_extensions()),
            ],
        ]);
        break;

    case 'os':
        respond([
            'ok' => true,
            'command' => 'os',
            'data' => [
                'family' => PHP_OS_FAMILY,
                'system' => php_uname('s'),
                'release' => php_uname('r'),
                'machine' => php_uname('m'),
            ],
        ]);
        break;

    case 'disk':
        $total = @disk_total_space(__DIR__);
        $free = @disk_free_space(__DIR__);
        respond([
            'ok' => true,
            'command' => 'disk',
            'data' => [
                'total_bytes' => $total ?: null,
                'free_bytes' => $free !== false ? $free : null,
                'used_percent' => ($total && $free !== false) ? round((1 - ($free / $total)) * 100, 1) : null,
            ],
        ]);
        break;

    case 'user':
        respond([
            'ok' => true,
            'command' => 'user',
            'data' => [
                'php_user' => get_current_user(),
                'server_user' => $_SERVER['REMOTE_USER'] ?? null,
            ],
        ]);
        break;

    case 'cwd':
        respond([
            'ok' => true,
            'command' => 'cwd',
            'data' => [
                'cwd' => getcwd() ?: __DIR__,
            ],
        ]);
        break;

    case 'health':
        respond([
            'ok' => true,
            'command' => 'health',
            'data' => [
                'status' => 'ONLINE',
                'timestamp' => date(DATE_ATOM),
            ],
        ]);
        break;

    default:
        respond(['ok' => false, 'error' => 'command_not_allowed', 'allowed' => ['server', 'php', 'os', 'disk', 'user', 'cwd', 'health']], 400);
}

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
