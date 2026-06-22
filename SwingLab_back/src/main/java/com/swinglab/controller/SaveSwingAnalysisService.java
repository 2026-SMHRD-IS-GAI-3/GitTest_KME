package com.swinglab.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.SwingAnalysisDAO;
import com.swinglab.model.SwingAnalysisSaveDTO;

@WebServlet("/saveSwingAnalysis")
public class SaveSwingAnalysisService extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final Gson gson = new Gson();
    private final SwingAnalysisDAO dao = new SwingAnalysisDAO();

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

        Map<String, Object> resultMap = new HashMap<>();

        try {
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();

            String line;

            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            SwingAnalysisSaveDTO dto =
                    gson.fromJson(sb.toString(), SwingAnalysisSaveDTO.class);

            if (dto.getUserId() <= 0) {
                resultMap.put("success", false);
                resultMap.put("message", "회원 정보가 없습니다.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            int result = dao.saveSwingAnalysis(dto);

            if (result > 0) {
                resultMap.put("success", true);
                resultMap.put("message", "스윙 분석 결과 저장 성공");
            } else {
                resultMap.put("success", false);
                resultMap.put("message", "스윙 분석 결과 저장 실패");
            }

        } catch (Exception e) {
            e.printStackTrace();

            resultMap.put("success", false);
            resultMap.put("message", "스윙 분석 결과 저장 중 오류가 발생했습니다.");
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