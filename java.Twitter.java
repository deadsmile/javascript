/**
 * 
 */

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.TwitterApi;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

/**
 */
public class TwitterAPI {
	private static final String PROTECTED_RESOURCE_URL = "https://api.twitter.com/1/statuses/update.json";
	private static final String ACCESSTOKEN_URL = "https://api.twitter.com/oauth/access_token";
	private static final String AUTHENTICATE_URL = "https://twitter.com/oauth/authenticate";
	private static final String AUTHORIZE_URL = "https://twitter.com/oauth/authorize";
	private static final String REQUESTTOKEN_URL = "https://api.twitter.com/oauth/request_token";
	
	private OAuthService service = null;
	private Token accessToken = null;
	
	public TwitterAPI(String apiKey, String apiSecret, String callback_url) {
		service = new ServiceBuilder()
						.provider(TwitterApi.class)
						.apiKey(apiKey)
						.apiSecret(apiSecret)
						.build();
	}
	
	public String getOAuthDialogUrl() throws UnsupportedEncodingException{ 
		return service.getAuthorizationUrl(service.getRequestToken());
	}
	
	public String getAccessToken(String v) {
		if(accessToken != null) {
			System.out.println(accessToken.getToken());
			return accessToken.getToken();
		}
		
		accessToken = service.getRequestToken();			
		Verifier verifier = new Verifier(v);
		
		accessToken = service.getAccessToken(service.getRequestToken(), verifier);
		System.out.println(accessToken.getToken());
		return accessToken.getToken();		
	}
	
	public void setAccessToken(String accessToken) {
		this.accessToken = new Token(accessToken, null);
	}
	
	public boolean hasValidAccessToken()
    {
            if (accessToken == null) {
                    return false;
            }
            final OAuthRequest request = new OAuthRequest(Verb.GET, "http://api.twitter.com/1/help/test.json"); //NON-NLS
            service.signRequest(accessToken, request);
            try {
                    final Response response = request.send();
                    if (response.getCode() == 200) {
                            return true;
                    }
            } catch (RuntimeException ignored) {
                    return false;
            }
            return false;
    }
	
	public void postLink(String url, String message) {
		try {
		OAuthRequest request = new OAuthRequest(Verb.POST, "https://api.twitter.com/1.1/statuses/update.json?status=" + URLEncoder.encode(url + " " + message, "UTF-8"));
        //request.addBodyParameter("status", message);
        //request.addBodyParameter("link", url);        
		
        service.signRequest(accessToken, request);
        Response response = request.send();
        
        System.out.println(response.getCode());
        System.out.println(response.getBody());
		} catch(Exception ex) {
			System.out.println(ex);
		}
	}
}
