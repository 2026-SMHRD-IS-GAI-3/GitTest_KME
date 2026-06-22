package com.swinglab.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.swinglab.model.CommunityDAO;
import com.swinglab.model.CommunityDTO;
import com.swinglab.model.CommunityFileDTO;

@WebServlet("/communityWrite")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 100,
        maxRequestSize = 1024 * 1024 * 300
)
public class CommunityWriteService extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final Gson gson = new Gson();
    private final CommunityDAO dao = new CommunityDAO();

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
            String userIdStr = request.getParameter("userId");
            String title = request.getParameter("title");
            String content = request.getParameter("content");

            if (userIdStr == null || userIdStr.trim().isEmpty()) {
                resultMap.put("success", false);
                resultMap.put("message", "로그인 정보가 없습니다.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            if (title == null || title.trim().isEmpty()) {
                resultMap.put("success", false);
                resultMap.put("message", "제목을 입력해주세요.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            if (content == null || content.trim().isEmpty()) {
                resultMap.put("success", false);
                resultMap.put("message", "내용을 입력해주세요.");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            int userId = Integer.parseInt(userIdStr);

            String postId =
                    "POST"
                            + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date())
                            + String.format("%04d", new Random().nextInt(9999) + 1);

            CommunityDTO postDto = new CommunityDTO();
            postDto.setPostId(postId);
            postDto.setUserId(userId);
            postDto.setTitle(title.trim());
            postDto.setContent(content.trim());

            int postResult = dao.insertPost(postDto);

            System.out.println("게시글 DB 저장 결과 : " + postResult);
            System.out.println("생성된 postId : " + postId);
            

            if (postResult <= 0) {
                resultMap.put("success", false);
                resultMap.put("message", "게시글 등록 실패");
                response.getWriter().print(gson.toJson(resultMap));
                return;
            }

            Part filePart = request.getPart("file");

            if (filePart != null && filePart.getSize() > 0) {

                String originalName = filePart.getSubmittedFileName();
                String contentType = filePart.getContentType();

                String fileType;

                if (contentType != null && contentType.startsWith("image/")) {
                    fileType = "image";
                } else if (contentType != null && contentType.startsWith("video/")) {
                    fileType = "video";
                } else {
                    resultMap.put("success", false);
                    resultMap.put("message", "이미지 또는 동영상 파일만 업로드할 수 있습니다.");
                    response.getWriter().print(gson.toJson(resultMap));
                    return;
                }

                String uploadPath = getServletContext().getRealPath("/uploads");
                System.out.println("업로드 경로 : " + uploadPath);
                File uploadDir = new File(uploadPath);

                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                String extension = "";

                int dotIndex = originalName.lastIndexOf(".");

                if (dotIndex != -1) {
                    extension = originalName.substring(dotIndex);
                }

                String saveName =
                        UUID.randomUUID().toString().replace("-", "") + extension;

                String fullPath =
                        uploadPath + File.separator + saveName;

                filePart.write(fullPath);

                String filePath =
                        "uploads/" + saveName;

                CommunityFileDTO fileDto = new CommunityFileDTO();
                fileDto.setPostId(postId);
                fileDto.setFileType(fileType);
                fileDto.setOriginalName(originalName);
                fileDto.setSaveName(saveName);
                fileDto.setFilePath(filePath);

                int fileResult = dao.insertCommunityFile(fileDto);
                System.out.println("파일 DB 저장 결과 : " + fileResult);
            }

            resultMap.put("success", true);
            resultMap.put("message", "게시글 등록 성공");

        } catch (Exception e) {
            e.printStackTrace();

            resultMap.put("success", false);
            resultMap.put("message", "게시글 등록 중 오류가 발생했습니다.");
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