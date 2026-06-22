package com.swinglab.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.swinglab.model.UserDAO;
import com.swinglab.model.UserDTO;

@WebServlet("/FindPasswordService")
public class FindPasswordService extends HttpServlet {

    private static final long serialVersionUID = 1L;

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

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/plain;charset=UTF-8");

        String email = request.getParameter("email");
        String name = request.getParameter("name");
        String phone = request.getParameter("phone");

        UserDTO dto = new UserDTO();
        dto.setEmail(email);
        dto.setName(name);
        dto.setPhone(phone);

        UserDAO dao = new UserDAO();
        UserDTO result = dao.findPasswordUser(dto);

        if (result != null) {
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