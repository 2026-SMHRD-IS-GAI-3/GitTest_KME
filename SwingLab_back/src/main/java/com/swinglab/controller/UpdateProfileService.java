package com.swinglab.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.MyPageDAO;

@WebServlet("/updateProfile")
public class UpdateProfileService extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final Gson gson = new Gson();
    private final MyPageDAO dao = new MyPageDAO();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();

        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        Map<String, Object> reqMap = gson.fromJson(sb.toString(), Map.class);

        String currentEmail = String.valueOf(reqMap.get("currentEmail"));
        String email = String.valueOf(reqMap.get("email"));
        String phone = String.valueOf(reqMap.get("phone"));
        String bodyCode = String.valueOf(reqMap.get("bodyCode"));

        int height = ((Double) reqMap.get("height")).intValue();
        int weight = ((Double) reqMap.get("weight")).intValue();

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("currentEmail", currentEmail);
        paramMap.put("email", email);
        paramMap.put("phone", phone);
        paramMap.put("height", height);
        paramMap.put("weight", weight);
        paramMap.put("bodyCode", bodyCode);

        Map<String, Object> resultMap = new HashMap<>();

        int result = dao.updateProfile(paramMap);

        if (result > 0) {
            resultMap.put("success", true);
            resultMap.put("message", "프로필 수정 성공");
        } else {
            resultMap.put("success", false);
            resultMap.put("message", "프로필 수정 실패");
        }

        response.getWriter().print(gson.toJson(resultMap));
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}