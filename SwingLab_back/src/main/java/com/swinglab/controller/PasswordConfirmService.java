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

@WebServlet("/passwordConfirm")
public class PasswordConfirmService extends HttpServlet {

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

        Map<String, String> reqMap = gson.fromJson(sb.toString(), Map.class);

        String email = reqMap.get("email");
        String password = reqMap.get("password");

        Map<String, Object> resultMap = new HashMap<>();

        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            resultMap.put("success", false);
            resultMap.put("message", "이메일 또는 비밀번호가 비어있습니다.");
            response.getWriter().print(gson.toJson(resultMap));
            return;
        }

        Map<String, String> paramMap = new HashMap<>();
        paramMap.put("email", email);
        paramMap.put("password", password);

        int count = dao.checkPassword(paramMap);

        if (count > 0) {
            resultMap.put("success", true);
            resultMap.put("message", "비밀번호 확인 성공");
        } else {
            resultMap.put("success", false);
            resultMap.put("message", "비밀번호가 일치하지 않습니다.");
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