package com.swinglab.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.UserDAO;
import com.swinglab.model.UserDTO;

@WebServlet("/login")
public class LoginService extends HttpServlet {

    private static final long serialVersionUID = 1L;

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

        Gson gson = new Gson();

        UserDTO inputDTO = gson.fromJson(sb.toString(), UserDTO.class);

        UserDAO dao = new UserDAO();
        UserDTO loginResult = dao.login(inputDTO);

        Map<String, Object> resultMap = new HashMap<>();

        if (loginResult != null) {
            HttpSession session = request.getSession();
            session.setAttribute("loginUser", loginResult);
            session.setMaxInactiveInterval(60 * 60);

            resultMap.put("success", true);
            resultMap.put("userId", loginResult.getUserId());
            resultMap.put("name", loginResult.getName());
            resultMap.put("nickname", loginResult.getNickname());
            resultMap.put("email", loginResult.getEmail());
        } else {
            resultMap.put("success", false);
            resultMap.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
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