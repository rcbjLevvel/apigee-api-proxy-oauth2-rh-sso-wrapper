body = JSON.parse(context.getVariable("response.content"));
context.setVariable("RCBJ0001", context.getVariable("response.content") );
var apigeeIssuedRefreshToken = body.refresh_token;
context.setVariable("apigeeIssuedRefreshToken", apigeeIssuedRefreshToken);