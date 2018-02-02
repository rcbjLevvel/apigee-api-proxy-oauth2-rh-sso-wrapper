# An Apigee API Proxy that wraps Red Hat SSO with the out-of-the-box OAuth2 implementation
This API Proxy demonstrates wrapping a third-party OAuth2/OIDC compliant Identity Provider (IdP) with Apigee's out-of-the-box OAuth2 implementation. The OAuth2 Authorization Code Grant and Client Credentials Grant are implemented in this API Proxy. The OpenID Connect Authorization Code flow will also work as is. The other OAuth2 Grants and OIDC flows are not implemented, but could easily be added using the exisitng examples as a guide. The Refresh Token Grant is also supported in this example.

This example uses Red Hat SSO v7.1 as the third-party IdP. In theory, any OAuth2-compliant, third-party IdP could be substituted in the example.  A common client definition must be shared between Apigee and the third-party IdP.  Of course, only the OAuth2 Grants and OIDC Flows mentioned above are supported in this example.

This example is discussed in more detail [here](https://medium.com/p/a10223eb334).

This post uses the OAuth2 + OIDC Debugger described [here](https://github.com/GetLevvel/oauth2-oidc-debugger).

The Red Hat SSO configuration needed to make this example work is described [here](https://medium.com/@robert.broeckelmann/openid-connect-authorization-code-flow-with-red-hat-sso-d141dde4ed3f).

## Getting Started
These instructions assume a working knowledge of Apigee Edge Public Cloud.

You can setup a free Apigee Edge Public Cloud account [here](https://enterprise.apigee.com).  There are various restrictions put in place on these types of accounts.  But, this API Proxy should be capable of working with those restrictions.

The quickest way to try out this project is to grab the API Proxy in [zip form](https://github.com/rcbjLevvel/apigee-api-proxy-oauth2-rh-sso-wrapper/blob/master/blog-rh-sso-integration.zip) and deploy it to your own Apigee Edge Public Cloud organization.

A cache must be created in Apigee Edge: ATZ_CODE_STATE_CACHE. The API Proxy stores authorization codes and refresh tokens belonging to valid sessions for the third-party IdP.

A Key Value Map must also be created in Apigee Edge: configuration. This KVM contains the following parameters:
* idpUserInfoEndpoint: The OIDC UserInfo Endpoint (example: /auth/realms/demo_project_sf/protocol/openid-connect/userinfo)
* idpTokenEndpoint: The OIDC Token Endpoint (example: /auth/realms/demo_project_sf/protocol/openid-connect/token)
* idpAuthorizationEndpoint: The OIDC Authorization Endpoint (example: /auth/realms/demo_project_sf/protocol/openid-connect/auth)
* idpHost (example: ec2-blah.compute-1.amazonaws.com:8443)

Customize each of these parameters to match your IdP.  Use the discovery endpoint to obtain the values. The hostname:port and path must be set in separate variables to accomodate how apigee builds the URL for the Service Callout Policy.

Besides these customizations, the API Proxy can be deployed as is.

### Prerequisites
To run this project you will need
* *An Apigee Edge account*
* *Working knowledge of Apigee Edge*
* *Access to an OIDC-compliant third-party IdP.

### Installing
1. Clone this repository to a local file system.
2. Install the apigeetool by running "npm -g install apigeetool".  If npm (Node Package Manager) is not already installed, then this will also need to be installed.
3. Deploy the API Proxy by running:
  ```
apigeetool deployproxy  -u admin_user_for_org -p admin_password -o apigee_org  -e env_name -n blog-rh-sso-integration -d ${REPOSITORY_HOME}/proxy
  ```
4. Log into the Apigee Edge Public Cloud console [here](https://enterprise.apigee.com).
5. Go to Publish->Products.
6. Click the "+Product" button in the upper left-hand corner.
7. Give the new Product a name of "OAuth2Test-API-Product".
8. Fill in the additional fields:
  * Display Name: Provide a meaningful display name.
  * Description: Provide a meaningful description.
  * Environment: Test
  * Key Approval Type: Automatic
  * Access: Public
  * Quota: Can be left blank
  * Allowed OAuth scopes: User
  * Paths: /
  * API Proxies: blog-rh-sso-integration
9. Click Save.
10. Go to Publisher->Developer Apps.
11. Click the "+Developer App" button.
12. Fill in the following parameters:
  * Name: blogTestApp
  * Display Name: A meaningful display name.
  * Developer Name: Yourself
  * Callback URL: http://localhost:3000/callback (so this can be used with the [OAuth2 + OIDC Debugger](https://github.com/GetLevvel/oauth2-oidc-debugger)
  * Expiration: Never
  * Products: The product created above (OAuth2Test-API-Product).
13. Click the Save button.
14. Click on "blogTestApp" in the list of Developer Apps.
15. Under Credentials, click on the Consumer Key button.
16. Save this value for later reference (this is the OAuth2 client identifier).
17. Under Credentials, click on the Consumer Secret button.
18. Save this value for later reference (this is the OAuth2 client secret).
19. Copy the following script to your local filesystem:
```
#!/bin/bash
#Update these variables with the values obtained earlier.
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=
KEY=
REALM=
RH_SSO_HOST=
curl -v -X POST \
-d ‘{ “clientId”: “${CLIENT_ID}”, “secret”: “${CLIENT_SECRET}”,”redirectUris”:[“${REDIRECT_URI}"] }’ \
-H “Content-Type:application/json” \
-H “Accept: application/json” \
-H “Authorization: Bearer KEY” \
https://${RH_SSO_HOST}:8443/auth/realms/${REALM}/clients-registrations/default --insecure -D headers.out
```
20. Update the following values in the shell script:
  * CLIENT_ID=the Apigee test application client_id that was just created.
  * CLIENT_SECRET=the Apigee test application client_secret that was just created.
  * REDIRECT_URI=the 3Scale test application redirect_uri that was just created.
  * KEY=INITIAL_ACCESS_TOKEN just created in Red Hat SSO
  * REALM=RH_SSO_REALM_NAME
  * RH_SSO_HOST=resolvable Red Hat SSO URL hostname
21. Run the shell script to create the client definition in Red Hat SSO.
22. Configure Red Hat SSO v7.1 to work with OpenID Connect per [this post](https://medium.com/@robert.broeckelmann/openid-connect-authorization-code-flow-with-red-hat-sso-d141dde4ed3f). If you aren't using Red Hat SSO, then follow the appropriate instructions for your third-party IdP.
23. Go to APIs->Environment.
24. Go to the Caches tab (should be the default).
25. Create a cache called ATZ_CODE_STATE_CACHE.
26. Go to the Key Value Maps tab.
27. Create a Key Value Map that contains the following values:
* idpUserInfoEndpoint: The OIDC UserInfo Endpoint (example: /auth/realms/demo_project_sf/protocol/openid-connect/userinfo)
* idpTokenEndpoint: The OIDC Token Endpoint (example: /auth/realms/demo_project_sf/protocol/openid-connect/token)
* idpAuthorizationEndpoint: The OIDC Authorization Endpoint (example: /auth/realms/demo_project_sf/protocol/openid-connect/auth)
* idpHost (example: ec2-blah.compute-1.amazonaws.com:8443)
28. Clone the [OAuth2 + OIDC Debugger](https://github.com/GetLevvel/oauth2-oidc-debugger) repo by running:
```
git clone https://github.com/GetLevvel/oauth2-oidc-debugger.git
```
29. Follow the instructions in this repo's [README.md](https://github.com/GetLevvel/oauth2-oidc-debugger/blob/master/README.md) to build and start the docker image.
30. Open a browser.
31. Go to http://localhost:3000.
32. Using the following values, use the OAuth2 + OIDC Debugger to obtain an access token:
  * Authorization Endpoint: https://org-env.apigee.net/oauth2/authorization (org = your org, env = env name)
  * Token Endpoint: https:/org-env.apigee.net/oauth2/token (org = your org, env = env name)
  * Client Identifier: Obtained above from the Consumer Key
  * Client Secret: Obtained above from the Consumer Secret
  * Callback: http://localhost:3000/callback
  * Scope: User
  * Username: configured in the third-party IdP (User1, if following the Red Hat SSO v7.1 post referenced above).
  * Password: configured in the third-party IdP (secret, if following the Red Hat SSO v7.1 post referenced above).
  * Validate Token Endpoint SSL: Yes
  * Display OIDC Artifacts: No
  * Use Refresh Tokens?: Yes (if needed) 

## Authors
* **Robert C. Broeckelmann Jr.** - *Initial work*

## License
This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
