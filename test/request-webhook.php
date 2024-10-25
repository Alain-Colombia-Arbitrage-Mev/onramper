<?php

function send($data) {
   // $url = 'http://localhost:3000/gateway';
    $url = 'https://webhook.usvptoken.com/gateway';
    $bearerToken = 'Mfeqr6ufjabYGFPGGBObdr1tug1qKEkNHR76iWjkcyLjN3nrTpbvTxognQArQTQr6fpPJY0kRAYTxN+JGWCL+Q==';
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($curl, CURLOPT_HEADER, FALSE);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json', 
        sprintf('Authorization: Bearer %s', $bearerToken)
    ]);
    $response = json_decode(curl_exec($curl));
    curl_close($curl); // Cierra el cURL
    return $response;
}

function testWebhookOnramperSuccess() {
    $params = [
        'country'            => 'US',
        'inAmount'           => 100.50,
        'onramp'             => 'example_onramp',
        'onrampTransactionId'=> 'txn_123456',
        'outAmount'          => 95.00,
        'partnerContext'     => 'example_context',
        'paymentMethod'      => 'credit_card',
        'sourceCurrency'     => 'USD',
        'status'             => 'success',
        'statusDate'         => '2024-10-20T12:34:56Z',
        'targetCurrency'     => 'EUR',
        'transactionHash'    => '0xabc123...',
        'transactionId'      => '123456789',
        'transactionType'    => 'deposit',
        'walletAddress'      => '0x12345abc...'
    ];

    return send($params);
}

var_dump(testWebhookOnramperSuccess());

