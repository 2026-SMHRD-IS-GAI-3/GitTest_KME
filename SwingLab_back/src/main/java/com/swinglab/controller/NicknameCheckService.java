package com.swinglab.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.swinglab.model.UserDAO;

@WebServlet("/NicknameCheckServlet")
public class NicknameCheckService extends HttpServlet {

    private static final long serialVersionUID = -1466242520499970699L;

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(response);
        response.setContentType("text/plain;charset=UTF-8");

        String nickname = request.getParameter("nickname");

        UserDAO dao = new UserDAO();
        boolean isAvailable = dao.checkNickname(nickname);

        if (isAvailable) {
            response.getWriter().print("available");
        } else {
            response.getWriter().print("duplicate");
        }
    }

    private void setCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
    }
}