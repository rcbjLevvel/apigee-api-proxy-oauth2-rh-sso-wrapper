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

A Key Value Map must also be created in  Apigee Edge: configuration. This KVM contains the following parameters:
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
4. Clone the OAuth + OIDC Debugger tool repository by running
```
git clone https://github.com/GetLevvel/oauth2-oidc-debugger.git
```
5. Follow the instruction's in this repo's README.md to build and start the docker image.
6. Open a browser.
7. Go to http://localhost:3000.

## Authors
* **Robert C. Broeckelmann Jr.** - *Initial work*

## License
This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
