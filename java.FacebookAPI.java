/**
 * 
 */
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.FacebookApi;
import org.scribe.model.*;
import org.scribe.oauth.OAuthService;
import net.sf.json.*; 

/**
 * <pre>
 * FacebookAPI.java
 *
 */
public class FacebookAPI {
	private static final String PROTECTED_RESOURCE_URL = "https://graph.facebook.com/me";
	public static final String PERMISSION = "user_photo_video_tags,friends_photos,read_insights,user_interests,user_photos,friends_online_presence,user_online_presence,read_stream,offline_access,publish_stream,email";
	
	private OAuthService service;
	private Token accessToken;	
	private String apiKey;
	private String apiSecret;
	
	public FacebookAPI(String apiKey, String apiSecret, String callback_url) {		
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
		
		service = new ServiceBuilder()
						.provider(FacebookApi.class)
						.scope("publish_stream")
						.apiKey(apiKey)
						.apiSecret(apiSecret)
						.callback(callback_url)
						.build();
	}
	
	public String getOAuthDialogUrl() throws UnsupportedEncodingException{ 
		return service.getAuthorizationUrl(null);
	}
	
	public void getAccessToken(String oauthVerifier) {
		Verifier v = new Verifier(oauthVerifier);
		accessToken = service.getAccessToken(null, v);
	}
	
	public void getFeed() {
		OAuthRequest request = new OAuthRequest(Verb.GET, "https://graph.facebook.com/me/feed");
		this.service.signRequest(accessToken, request);
		Response response = request.send();

		try {
			JSONObject json = JSONObject.fromObject(response.getBody());
			System.out.println(accessToken);
			System.out.println(json.toString());
		} catch (Exception e) {
			
		}		
	}
	
	public void setAccessToken(String accessToken) {
		this.accessToken = new Token(accessToken, null);
	}
	
	public JSONObject getProfile() {
		OAuthRequest request = new OAuthRequest(Verb.GET, "https://graph.facebook.com/me");
		this.service.signRequest(accessToken, request);
		Response response = request.send();

		try {
			JSONObject json = JSONObject.fromObject(response.getBody());
			return json;
		} catch(Exception ex){
			
		}
		return null;
	}
	
	public void postLink(String message, String url) throws UnsupportedEncodingException {
		if (!hasValidAccessToken()) {
            refreshAccessToken();
		}
		
		OAuthRequest request = new OAuthRequest(Verb.POST, "https://graph.facebook.com/me/feed");
		request.addHeader("Content-Type", "text/html; charset=UTF-8");
		request.addBodyParameter("link", url);
		request.addBodyParameter("message", message);
		this.service.signRequest(accessToken, request);
		Response response = request.send();
		System.out.println(response.getBody());
		try {
		} catch(Exception ex){
			
		}
	}
	
	private void refreshAccessToken()
    {
            final String url = new StringBuilder().append("https://graph.facebook.com/oauth/access_token?client_id=").append(apiKey).append("&client_secret=").append(apiSecret).append(
                            "&grant_type=fb_exchange_token&fb_exchange_token=").append(accessToken.getToken()).toString();
    }
	
	public boolean hasValidAccessToken()
    {
            if (accessToken == null) {
                    return false;
            }
            final OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, "https://graph.facebook.com/me"); //NON-NLS
            service.signRequest(accessToken, oAuthRequest);
            try {
                    final Response response = oAuthRequest.send();
                    if (response.getCode() == 200) {
                            return true;
                    }
            } catch (RuntimeException ignored) {
                    return false;
            }
            return false;
    }
}
