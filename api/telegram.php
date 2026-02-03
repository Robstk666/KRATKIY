<?php
// telegram.php

// 1. Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// 2. Read JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// 3. Validate input
$name = isset($data['name']) ? trim($data['name']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and Phone are required']);
    exit;
}

// 4. Telegram Configuration
// TODO: For better security, consider moving these to a separate config file outside public_html.
$BOT_TOKEN = '8492152792:AAGzj0F6NQPN0du9AiC2YsIaqtBsvvMy5n4';
$CHAT_ID = '379728160';

// 5. Format Message
$text = "📩 *Новая заявка с сайта!*\n\n";
$text .= "👤 *Имя:* " . $name . "\n";
$text .= "📞 *Телефон:* " . $phone . "\n";
$text .= "📝 *Сообщение:*\n" . ($message ? $message : 'Без сообщения');

// 6. Send to Telegram
$url = "https://api.telegram.org/bot{$BOT_TOKEN}/sendMessage";
$post_data = [
    'chat_id' => $CHAT_ID,
    'text' => $text,
    'parse_mode' => 'Markdown'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// 7. Handle Response
if ($http_code == 200 && $result) {
    $response_data = json_decode($result, true);
    if (isset($response_data['ok']) && $response_data['ok']) {
        http_response_code(200);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Telegram API Error', 'details' => $response_data]);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Request Failed', 'curl_error' => $curl_error]);
}
?>
