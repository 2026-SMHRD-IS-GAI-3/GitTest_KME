package com.swinglab.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.SwingAnalysisDAO;
import com.swinglab.model.SwingAnalysisSaveDTO;

@WebServlet("/historyDetail")
public class HistoryDetailService extends HttpServlet {

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
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String analysisIdStr = request.getParameter("analysisId");

            if (analysisIdStr == null || analysisIdStr.trim().isEmpty()) {
                resultMap.put("success", false);
                resultMap.put("message", "분석 번호가 없습니다.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            int analysisId = Integer.parseInt(analysisIdStr);

            SwingAnalysisSaveDTO detail = dao.selectHistoryDetail(analysisId);
            List<Map<String, Object>> sectionScores = dao.selectSectionScores(analysisId);
            List<String> feedbacks = dao.selectFeedbacks(analysisId);

            resultMap.put("success", true);
            resultMap.put("data", detail);
            resultMap.put("sectionScores", sectionScores);
            resultMap.put("feedbacks", feedbacks);

        } catch (Exception e) {
            e.printStackTrace();

            resultMap.put("success", false);
            resultMap.put("message", "분석 상세 조회 중 오류가 발생했습니다.");
        }

        response.getWriter().print(gson.toJson(resultMap));
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}