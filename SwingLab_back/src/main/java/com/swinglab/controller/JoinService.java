package com.swinglab.controller;

import java.io.IOException;
import java.security.MessageDigest;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.UserDAO;
import com.swinglab.model.UserDTO;

@WebServlet("/ConnectServlet")
public class JoinService extends HttpServlet {

    private static final long serialVersionUID = 5234873908555312841L;

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(response);

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String nickname = request.getParameter("nickname");
        String phone = request.getParameter("phone");

        String rawGender = request.getParameter("gender");
        String gender_type = null;

        if (rawGender != null) {
            if (rawGender.equals("male")) {
                gender_type = "M";
            } else if (rawGender.equals("female")) {
                gender_type = "F";
            }
        }

        // 비밀번호 암호화 사용하려면 아래 줄 사용
        // String hashedPassword = hashPassword(password);

        UserDTO dto = new UserDTO(
                name,
                email,
                password,
                nickname,
                phone,
                gender_type
        );

        UserDAO dao = new UserDAO();
        int result = dao.insertUser(dto);

        Gson gson = new Gson();

        if (result > 0) {
            response.getWriter().print(
                    gson.toJson(new JoinResult("success", "회원가입 성공"))
            );
        } else {
            response.getWriter().print(
                    gson.toJson(new JoinResult("fail", "회원가입 실패"))
            );
        }
    }

    private void setCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
    }

    private String hashPassword(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes("UTF-8"));

            StringBuilder hexString = new StringBuilder();

            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);

                if (hex.length() == 1) {
                    hexString.append('0');
                }

                hexString.append(hex);
            }

            return hexString.toString();

        } catch (Exception ex) {
            return base;
        }
    }

    class JoinResult {
        String status;
        String message;

        JoinResult(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}