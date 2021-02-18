# WIP HTTP => SMTP Service

It is an HTTP => SMTP bridge service. Simple middleware if needed to send email, but the sender service does not have
direct access to the SMTP relay or wanted to call directly the remote MTA.

It is does not use any queue to temporally store emails it returns with the result of the communication. The result is
200 or 400 with the error message

## Environment variables

| Name | Default | Description |
| ---- | ------- | ----------- |
| PORT | 3000 | Port number where the service listening |
| JSON_BODY_MAX_LENGTH | `100 kb` | The maximum [size](https://www.npmjs.com/package/bytes) of HTTP request length |
| SMTP_RELAY_HOST | `undefined` | The IP address or the host name of the SMTP Relay service. If it is empty it will directly connect to the remote MTA |
| SMTP_RELAY_PORT | `25` | The port of the SMTP Relay service. |
| SMTP_RELAY_USER | `undefined` | The authentication user name of the relay host if auth required |
| SMTP_RELAY_PASSWORD | `undefined` | The authentication password of the relay host if auth required. If the `SMTP_RELAY_USER` not defined then this value will omitted |
| SMTP_USE_TLS | `false` | Set `true` if try to use TLS for SMTP Relay connection. TLS will use only if the Relay support it |
| SMTP_FORCE_TLS | `false` | Set `true` if MUST use TLS for SMTP Relay connection. If the Relay does not support TLS then the email sending won't work |
| SMTP_ACCEPT_INVALID_CERT | `false` | Set `true` accept invalid/self signed certificate |
| SMTP_NOT_FAIL_ON_INVALID_TLS | `false` | Set it to `true` if the accept self sign or expired TLS certificates |
| SMTP_DKIM_DOMAIN | `undefined` | Sign every email with DKIM. If the request contains DKIM info then it will use instead of the default |
| SMTP_DKIM_KEY_SELECTOR | `undefined` | If the `SMTP_DKIM_KEY_SELECTOR` not defined then this value will omitted |
| SMTP_DKIM_PRIVATE_KEY | `undefined` | If the `SMTP_DKIM_PRIVATE_KEY` not defined then this value will omitted |

## Example request

The minimal request
```json
{
  "from": {
    "email": "from@example.com"
  },
  "html": "<p>Hello</p>",
  "subject": "Hello",
  "to": [
    {
      "email": "to@example.com"
    }
  ]
}
```

## TODOs

- message id
- priority
- custom headers
- SMTP connection pooling
- large emails
- improve MX record caching
