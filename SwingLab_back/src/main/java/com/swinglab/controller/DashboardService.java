package com.swinglab.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.DashboardDAO;
import com.swinglab.model.DashboardDTO;

@WebServlet("/dashboard")
public class DashboardService extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");

        response.setContentType("application/json;charset=UTF-8");

        DashboardDAO dao = new DashboardDAO();
        DashboardDTO dto = dao.getDashboard();

        Gson gson = new Gson();
        String json = gson.toJson(dto);

        response.getWriter().print(json);
    }
}