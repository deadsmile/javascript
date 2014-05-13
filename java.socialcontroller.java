import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.FacebookAPI;
import com.TwitterAPI;

/**
 * 
 */

@Controller
public class SocialController {
	public static final String FB_APP_ID = "";
	public static final String FB_APP_SECRET = "";
	public static final String FB_OAUTH_CALLBACK = "";
	
	public static final String TW_APP_ID = "";
	public static final String TW_APP_SECRET = "";
	public static final String TW_OAUTH_CALLBACK = "";	
	
	private static String FBaccessToken = "";
	
	private static FacebookAPI fb = new FacebookAPI(FB_APP_ID, FB_APP_SECRET, FB_OAUTH_CALLBACK);;
	private static TwitterAPI tw = new TwitterAPI(TW_APP_ID, TW_APP_SECRET, TW_OAUTH_CALLBACK);;
		
	@RequestMapping(value="/social/checkAuth.do", method=RequestMethod.GET)
	public ModelAndView checkAuth(HttpServletRequest request) throws Exception {
		String type = request.getParameter("type");
		String tokenKey = null;
		
		ModelAndView modelAndView = new ModelAndView();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		// DB에서 토큰키를 조회해서 없으면
		if(tokenKey == null) {
			if("fb".equals(type)) {				
				String dialog_url = fb.getOAuthDialogUrl();
				resultMap.put("result", true);
				resultMap.put("message", "not auth");
				resultMap.put("process", "popup");
				resultMap.put("url", dialog_url);				
			} else if("tw".equals(type)) {
				String dialog_url = tw.getOAuthDialogUrl();
				resultMap.put("result", true);
				resultMap.put("message", "not auth");
				resultMap.put("process", "popup");
				resultMap.put("url", dialog_url);					}						
		} else {
			if("fb".equals(type)) {	
	
			}
		}
			
		modelAndView.addAllObjects(resultMap);
		modelAndView.setViewName("jsonView");
		return modelAndView;
	}
	
	@RequestMapping("/social/saveFacebookToken.do")
	public ModelAndView saveFacebookToken(HttpServletRequest request) throws Exception {
		ModelAndView modelAndView = new ModelAndView();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String code = request.getParameter("code");
		fb.getAccessToken(code);
		// 세션, DB에 저장
		//request.getSession().setAttribute("FacebookToken", tokenKey);		
		
		resultMap.put("result", true);
		modelAndView.addAllObjects(resultMap);
		modelAndView.setViewName("jsonView");
		return modelAndView;
	}
	
	@RequestMapping("/social/saveTwitterToken.do")
	public ModelAndView saveTwitterToken(HttpServletRequest request) {
		String code = request.getParameter("code");
		tw.getAccessToken(code);
		
		//request.getSession().setAttribute("FacebookToken", tokenKey);	
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("jsonView");
		return modelAndView;
	}
	
	@RequestMapping("/social/comment.do")
	public String comment(Model model) throws Exception {
		return "/social/comment";
	}
	
	@RequestMapping("/social/feed.do")
	public ModelAndView feed() {
		ModelAndView modelAndView = new ModelAndView();
		fb.setAccessToken("");
		fb.getFeed();
		modelAndView.setViewName("jsonView");
		return modelAndView;
	}
	
	@RequestMapping("/social/twitter.do")
	public ModelAndView twitter() {
		ModelAndView modelAndView = new ModelAndView();
		tw.setAccessToken("");
		tw.postLink("aaa", "");
		modelAndView.setViewName("jsonView");
		return modelAndView;
	}
	
	@RequestMapping("/social/test.do")
	public ModelAndView test(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		ModelAndView modelAndView = new ModelAndView();
		Map resultMap = new HashMap();
		resultMap.put("result1", "11");		
		resultMap.put("result2", "22");				
		
		modelAndView.addAllObjects(resultMap);
		modelAndView.setViewName("jsonView");
		return modelAndView;
	}
	
	@RequestMapping("/social/post.do")
	public ModelAndView post(final HttpServletRequest request, final HttpServletResponse response) throws Exception {

		fb.setAccessToken("");
		
		fb.postLink("aawdskmaaa", "");
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("jsonView");
		return modelAndView;
	}
}
