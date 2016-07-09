package com.example.joshuag.eventphoto;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

public class Profile extends AppCompatActivity
{

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        String msg = intent.getStringExtra(RegisterActivity.LOGIN_MESSAGE);

        TextView textView = (TextView) findViewById(R.id.profile_text_view);
        textView.setText(msg);

    }
}
