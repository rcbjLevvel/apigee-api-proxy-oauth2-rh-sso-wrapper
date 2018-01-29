# An Apigee API Proxy that wraps Red Hat SSO with the out-of-the-box OAuth2 implementation
This API Proxy demonstrates wrapping a third-party OAuth2/OIDC compliant Identity Provider (IdP) with Apigee's OAuth2 implementation.

This is the source code and configuration used in a blog post describing how to protect APIs proxied by Apigee Edge using OAuth2 and JWT. Azure Active Directory is used as the Identity Provider.

The theory and end result is described in detail in this blog post.

The configuration of the Azure Active Directory tenant needed to make this work is described in this blog post.

Getting Started
These instructions assume a working knowledge of Apigee Edge Public Cloud.

You can setup a free Apigee Edge Public Cloud account here. There are various restrictions put in place on these types of accounts. But, this API Proxy should be capable of working with those restrictions.

The quickest way to try out this project is to grab the API Proxy in zip form and deploy it to your own Apigee Edge Public Cloud community edition organization.

An Apigee Cache called signer-cert must be created in the environment before the API Proxy can be deployed.

## Getting Started
These instructions assume a working knowledge of Apigee Edge Public Cloud.

You can setup a free Apigee Edge Public Cloud account [here](https://enterprise.apigee.com).  There are various restrictions put in place on these types of accounts.  But, this API Proxy should be capable of working with those restrictions.

The quickest way to try out this project is to grab the API Proxy in [zip form](https://github.com/rcbj/apigee-jwt-aad-timeapi-proxy/blob/master/proxy/AD-JWT-Protected-API-Proxy.zip) and deploy it to your own Apigee Edge Public Cloud community edition organization.

An Apigee Cache called signer-cert must be created in the environment before the API Proxy can be deployed.

Unfortunately, it costs me money to keep an AAD tenant running that will always work with this example out of the box.  Plus, open up some potentially undesirable security issues.  So, it will be necessary to setup your own AAD tenant with a test user account, global administrator account, API Consumer application definition, and API Provider application definition.  Once these are created, take note of the client_id for the API Consumer, the audience information for the API Provider, and test account username and password.

To that end, you must update the Federation Metadata URL that is referenced in the Service Callout policy in the conditional rule called "parse + validate alg=RS256-ms".  In the Java Callout Policy, the claim_iss and claim_aud properties must be updated to reflect your configuration.  Save and deploy these updates.

In the test-client directory, there is a bash shell script called test-client.sh, that simulates obtaining a JWT token from AAD and making an API call.  Make the following updates.
* *Update the CLIENT_ID variable to a valid value for your AAD tenant.*
* *Update the USERNAME_ variable to a valid value for your AAD tenant.*
* *Update the PASSWORD_ variable to a valid value for your AAD tenant.*
* *Update the RESOURCE_URL variable to a valid value for your AAD tenant.*
* *Update the TENANT_ID variable to the identifier for your AAD tenant.*
This script doesn't require any parameters.  To execute it, run
```
./test-client.sh
```
You  can enable the API Proxy Trace in the Apigee Management Console.
### Prerequisites
To run this project you will need
* *An Apigee Edge account*
* *Working knowledge of Apigee Edge*
* *Access to an Azure Active Directory tenant that has been configured similar to [this post](https://www.medium.com)*
* *Working knowledge of Azure Active Directory (or careful review of the [this post](https://www.medium.com))*

### Installing
1. Clone this repository to a local file system.
2. Install the apigeetool by running "npm -g install apigeetool".  If npm (Node Package Manager) is not already installed, then this will also need to be installed.
3. Deploy the API Proxy by running:
  ```
apigeetool deployproxy  -u admin_user_for_org -p admin_password -o apigee_org  -e env_name -n jwt_signed -d ${REPOSITORY_HOME}/proxy
  ```
4. Update the Federation Metadata URL that is referenced in the Service Callout policy in the conditional rule called "parse + validate alg=RS256-ms".  
5. In the Java Callout Policy, the claim_iss and claim_aud properties must be updated to reflect your configuration.  
6. Save and deploy these updates.
7. On the local file system where you cloned this repository, In the test-client directory, there is a bash shell script called test-client.sh, that simulates obtaining a JWT token from AAD and making an API call.  Make the following updates.
  * *Update CLIENT_ID variable to a valid value for your AAD tenant.*
  * *Update USERNAME_ variable to a valid value for your AAD tenant.*
  * *Update PASSWORD_ variable to a valid value for your AAD tenant.*
  * *Update the RESOURCE_URL variable to a valid value for your AAD tenant.*
  * *Update the TENANT_ID variable to the identifier for your AAD tenant.*
8. To test the API, run:
  ```
./test-client.sh
  ```

## Authors
* **Robert C. Broeckelmann Jr.** - *Initial work*

## License
This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

