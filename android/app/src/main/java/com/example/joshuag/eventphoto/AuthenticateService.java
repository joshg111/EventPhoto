package com.example.joshuag.eventphoto;

// Imports for Retrofit

import android.util.Base64;
import android.util.Log;

import java.io.IOException;
import java.lang.annotation.Annotation;

import okhttp3.OkHttpClient;
import okhttp3.ResponseBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Converter;
import retrofit2.GsonConverterFactory;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.http.DELETE;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;


public final class AuthenticateService
{
    public static final String API_URL = "http://scout.louiehome.com";
    private static final String TAG = "AuthenticateService";
    private final Authenticate authService;
    private Response<OAuthTokenResponse> oAuthTokenRsp;
    private String id;
    private String secret;
    private Converter<ResponseBody, Error> errorConverter;

    public String getId()
    {
        return id;
    }

    public String getSecret()
    {
        return secret;
    }

    public AuthenticateService(String id, String secret)
    {
        this.id = id;
        this.secret = secret;
        HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
        interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(interceptor).build();

        // Create a very simple REST adapter which points the louie API.
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(API_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();

        // Create an instance of our GitHub API interface.
        authService = retrofit.create(Authenticate.class);

        errorConverter = retrofit.responseBodyConverter(Error.class, new Annotation[0]);
        oAuthTokenRsp = null;
    }

    public class OAuthTokenResponse
    {
        public final String access_token;
        private final String refresh_token;
        public final String detail;

        public OAuthTokenResponse(String access_token, String refresh_token, String detail)
        {
            this.refresh_token = refresh_token;
            this.access_token = access_token;
            this.detail = detail;
        }
    }

    public static class StatusResponse
    {

        private final String status;

        public StatusResponse(String status, String detail)
        {
            this.status = status;
        }
    }

    // I'm not sure if this class should be public or private.
    public static class ClientResponse
    {
        public final String id;
        public final String secret;

        public ClientResponse(String id, String secret)
        {

            this.id = id;
            this.secret = secret;
        }
    }

    public static class Error
    {
        public final String detail;

        public Error(String detail)
        {
            this.detail = detail;
        }
    }

    public interface Authenticate
    {
        @POST("/clients/register")
        Call<ClientResponse> sendClientReq();

        @Headers({
            "Content-Type: application/x-www-form-urlencoded"
        })
        @FormUrlEncoded
        @POST("/users/register")
        Call<StatusResponse> register(@Field("username") String username, @Field("password") String password);

        @Headers({
            "Content-Type: application/x-www-form-urlencoded"
        })
        @FormUrlEncoded
        @POST("/oauth/token")
        Call<OAuthTokenResponse> sendOAuthTokenReq(
                @Header("Authorization") String authorization,
                @Field("username") String username,
                @Field("password") String password,
                @Field("grant_type") String grantType);

        @Headers({
                "Content-Type: application/x-www-form-urlencoded"
        })
        @FormUrlEncoded
        @POST("/oauth/token")
        Call<OAuthTokenResponse> sendOAuthTokenRefresh(
                @Header("Authorization") String authorization,
                @Field("refresh_token") String refreshToken,
                @Field("grant_type") String grantType);

        @DELETE("/oauth/token")
        Call<StatusResponse> sendOAuthTokenDelete(
                @Header("Authorization") String authorization);
    }

    public ClientResponse sendClientRequest() throws IOException
    {
        // Create a call instance for looking up Retrofit contributors.
        Call<ClientResponse> call = authService.sendClientReq();
        ClientResponse clientRsp = call.execute().body();

        // Set the new id/secret.
        this.id = clientRsp.id;
        this.secret = clientRsp.secret;
        return clientRsp;
    }

    public StatusResponse sendRegistrationRequest(String username, String password) throws IOException
    {
        // Create a call instance for looking up Retrofit contributors.
        Call<StatusResponse> call = authService.register(username, password);
        Response<StatusResponse> rsp = call.execute();
        if(rsp.code() != 201)
        {
            Log.e(TAG, "User registration response code = " + Integer.toString(rsp.code()));
            Error error = errorConverter.convert(rsp.errorBody());
            throw new IOException(error.detail);
        }
        return rsp.body();
    }

    public Response<OAuthTokenResponse> sendOAuthTokenRequest
    (
    String username, String password
    ) throws IOException
    {
        String encodedAuth = createAuthHeader();
        // Create a call instance for looking up Retrofit contributors.
        Call<OAuthTokenResponse> call = authService.sendOAuthTokenReq(encodedAuth, username, password, "password");
        Response<OAuthTokenResponse> rsp = call.execute();
        return rsp;
    }

    private String createAuthHeader()
    {
        String authText = id + ":" + secret;
        String encodedAuth = Base64.encodeToString(authText.getBytes(), Base64.DEFAULT);
        encodedAuth = "Basic " + encodedAuth;
        Log.d("AuthenticateService", "encodedAuth = " + encodedAuth);
        encodedAuth = encodedAuth.trim();
        encodedAuth = encodedAuth.replaceAll("(\\r|\\n)", "");
        return encodedAuth;
    }

    public Response<OAuthTokenResponse> sendOAuthTokenRefresh
    (
        String refresh_token
    ) throws IOException
    {
        String encodedAuth = createAuthHeader();
        // Create a call instance for looking up Retrofit contributors.
        Call<OAuthTokenResponse> call = authService.sendOAuthTokenRefresh(encodedAuth, refresh_token, "refresh_token");
        Response<OAuthTokenResponse> rsp = call.execute();
        return rsp;
    }

    public Response<OAuthTokenResponse> authenticateUser(String username, String password) throws IOException
    {
        oAuthTokenRsp = sendOAuthTokenRequest(username, password);
        return oAuthTokenRsp;
    }

    public Response<OAuthTokenResponse> createUser(String username, String password) throws IOException
    {
        StatusResponse registerResponse = null;

        if(this.id.isEmpty() || this.secret.isEmpty())
        {
            sendClientRequest();
        }

        registerResponse = sendRegistrationRequest(username, password);

        if(registerResponse == null)
        {
            Log.e(TAG, "Failed to get registerResponse");
            return null;
        }

        oAuthTokenRsp = sendOAuthTokenRequest(username, password);

        return oAuthTokenRsp;

    }

    public void setId(String id)
    {
        this.id = id;
    }

    public void setSecret(String secret)
    {
        this.secret = secret;
    }

    public String refreshUser(String refresh_token) throws IOException
    {
        oAuthTokenRsp = sendOAuthTokenRefresh(refresh_token);

        if(oAuthTokenRsp == null)
        {
            Log.e("AuthenticateService", "Failed to get oAuth response for refresh request");
            return null;
        }

        return oAuthTokenRsp.body().refresh_token;
    }

    public boolean logoutUser() throws IOException
    {
        String authHeader = "Bearer " + oAuthTokenRsp.body().access_token;
        Call<StatusResponse> call = authService.sendOAuthTokenDelete(authHeader);
        Response<StatusResponse> rsp = call.execute();
        return (rsp != null && rsp.code() == 200);
    }

}
