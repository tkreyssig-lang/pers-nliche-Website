<?php
// Kontaktformular-Handler für tomkreyssig.de
// Voraussetzung: PHP-Hosting mit funktionierender mail()-Funktion (z. B. Hostinger).

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html#kontakt');
    exit;
}

// Honeypot: unsichtbares Feld, das nur Bots ausfüllen
if (!empty($_POST['website'])) {
    header('Location: index.html?sent=1#kontakt');
    exit;
}

function clean_header_value(string $value): string {
    return trim(str_replace(["\r", "\n"], '', $value));
}

$name = clean_header_value($_POST['name'] ?? '');
$email = clean_header_value($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html?error=1#kontakt');
    exit;
}

$to = 'tom.kreyssig@web.de';
$subject = 'Neue Kontaktanfrage über die Website';
$body = "Name: $name\nE-Mail: $email\n\nNachricht:\n$message\n";

// TODO: Absenderadresse an die eigene Domain anpassen, sobald diese feststeht
// (verbessert die Zustellbarkeit / verhindert Spam-Einstufung).
$headers = "From: webseite@tomkreyssig.de\r\n";
$headers .= "Reply-To: $email\r\n";

$sent = @mail($to, $subject, $body, $headers);

header('Location: index.html?' . ($sent ? 'sent=1' : 'error=1') . '#kontakt');
exit;
