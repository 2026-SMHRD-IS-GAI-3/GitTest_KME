package com.swinglab.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.swinglab.model.UserDAO;
import com.swinglab.model.UserDTO;

@WebServlet("/FindEmailService")
public class FindEmailService extends HttpServlet {

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

        String name = request.getParameter("name");
        String phone = request.getParameter("phone");

        System.out.println("====== [아이디 찾기 요청] ======");
        System.out.println("이름 : " + name);
        System.out.println("전화번호 : " + phone);

        UserDTO dto = new UserDTO();
        dto.setName(name);
        dto.setPhone(phone);

        UserDAO dao = new UserDAO();
        String foundEmail = dao.findEmail(dto);

        System.out.println("찾은 이메일 : " + foundEmail);
        System.out.println("==============================");

        if (foundEmail != null) {
            response.getWriter().print(foundEmail);
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