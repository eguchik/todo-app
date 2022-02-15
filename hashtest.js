var crypto = reqire('crypto')

var
  hmac,
  calculatedSignature,
  payload = req.body;

secret = 'dznURzbtTcZbfPQ'

hmac = crypto.createHmac('sha1', secret);
hmac.update(JSON.stringify(payload));
calculatedSignature = 'sha1=' + hmac.digest('hex');

if (req.headers['x-hub-signature'] === calculatedSignature) {
  console.log('all good');
} else {
  console.log('not good');
}