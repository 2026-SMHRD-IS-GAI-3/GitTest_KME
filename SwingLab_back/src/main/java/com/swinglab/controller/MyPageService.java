package com.swinglab.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.MyPageDAO;
import com.swinglab.model.MyPageDTO;
import com.swinglab.model.UserDTO;

@WebServlet("/mypageInfo")
public class MyPageService extends HttpServlet {

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
        response.setContentType("application/json;charset=UTF-8");

        Gson gson = new Gson();
        Map<String, Object> resultMap = new HashMap<>();

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("loginUser") == null) {
            resultMap.put("success", false);
            resultMap.put("message", "로그인이 필요합니다.");
            response.getWriter().print(gson.toJson(resultMap));
            return;
        }

        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");

        MyPageDAO dao = new MyPageDAO();
        MyPageDTO dto = dao.getMyPageInfo(loginUser.getUserId());

        if (dto != null) {
            resultMap.put("success", true);
            resultMap.put("data", dto);
        } else {
            resultMap.put("success", false);
            resultMap.put("message", "마이페이지 정보를 불러오지 못했습니다.");
        }

        response.getWriter().print(gson.toJson(resultMap));
    }

    private void setCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}