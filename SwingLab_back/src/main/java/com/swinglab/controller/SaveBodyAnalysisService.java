package com.swinglab.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.BodyAnalysisDAO;
import com.swinglab.model.BodyAnalysisDTO;
import com.swinglab.model.UserDTO;

@WebServlet("/saveBodyAnalysis")
public class SaveBodyAnalysisService extends HttpServlet {

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
        response.setContentType("application/json;charset=UTF-8");

        Map<String, Object> resultMap = new HashMap<>();
        Gson gson = new Gson();

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("loginUser") == null) {
            resultMap.put("success", false);
            resultMap.put("message", "로그인이 필요합니다.");
            response.getWriter().print(gson.toJson(resultMap));
            return;
        }

        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();

        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        BodyAnalysisDTO dto = gson.fromJson(sb.toString(), BodyAnalysisDTO.class);
        dto.setUserId(loginUser.getUserId());

        System.out.println("===== 체형 분석 저장 요청 =====");
        System.out.println("USER_ID : " + dto.getUserId());
        System.out.println("HEIGHT : " + dto.getHeight());
        System.out.println("WEIGHT : " + dto.getWeight());
        System.out.println("HAND_TYPE : " + dto.getHandType());
        System.out.println("BODY_CODE : " + dto.getBodyCode());

        BodyAnalysisDAO dao = new BodyAnalysisDAO();
        int result = dao.saveBodyAnalysis(dto);

        if (result > 0) {
            resultMap.put("success", true);
            resultMap.put("message", "체형 분석 결과 저장 성공");
        } else {
            resultMap.put("success", false);
            resultMap.put("message", "체형 분석 결과 저장 실패");
        }

        response.getWriter().print(gson.toJson(resultMap));
    }

    private void setCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}