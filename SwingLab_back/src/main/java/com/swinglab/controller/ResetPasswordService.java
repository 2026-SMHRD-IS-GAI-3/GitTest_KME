package com.swinglab.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.swinglab.model.UserDAO;
import com.swinglab.model.UserDTO;

@WebServlet("/ResetPasswordService")
public class ResetPasswordService extends HttpServlet {

    private static final long serialVersionUID = 1L;

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
        response.setContentType("text/plain;charset=UTF-8");

        String email = request.getParameter("email");
        String newPw = request.getParameter("newPw");

        System.out.println("====== [비밀번호 변경 요청] ======");
        System.out.println("email : [" + email + "]");
        System.out.println("newPw : [" + newPw + "]");

        UserDTO dto = new UserDTO();
        dto.setEmail(email);
        dto.setPassword(newPw);

        UserDAO dao = new UserDAO();
        int result = dao.resetPassword(dto);

        System.out.println("비밀번호 변경 결과 result : " + result);
        System.out.println("================================");

        if (result > 0) {
            response.getWriter().print("success");
        } else {
            response.getWriter().print("fail");
        }
    }

    private void setCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
    }
}