import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Terms } from './pages/Terms';
import { SignupForm } from './pages/SignupForm';
import { BodyInfo } from './pages/BodyInfo';
import { BodyTypeSurvey } from './pages/BodyTypeSurvey';
import { SurveyResult } from './pages/SurveyResult';
import { VideoUpload } from './pages/VideoUpload';
import { AnalysisResult } from './pages/AnalysisResult';
import { MyPage } from './pages/MyPage';
import { Dashboard } from './pages/Dashboard';
import { PasswordConfirm } from './pages/PasswordConfirm';
import { ProfileEdit } from './pages/ProfileEdit';
import { PasswordChange } from './pages/PasswordChange';
import { Subscription } from './pages/Subscription';
import { History } from './pages/History';
import { Community } from './pages/Community';
import { CommunityWrite } from './pages/CommunityWrite';
import { CommunityPost } from './pages/CommunityPost';
import { FindAccount } from './pages/FindAccount';
import { Records } from './pages/Records';
import { Admin } from './pages/Admin';
import { Storyboard } from './pages/Storyboard';
import { DocsExport } from './pages/DocsExport';
import { Layout } from './components/Layout';
import { HistoryDetail } from './pages/HistoryDetail';
import { HistoryAll } from './pages/HistoryAll';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Navigate to="/signup/terms" replace />} />
          <Route path="signup/terms" element={<Terms />} />
          <Route path="signup/form" element={<SignupForm />} />
          <Route path="body-info" element={<BodyInfo />} />
          <Route path="survey" element={<BodyTypeSurvey />} />
          <Route path="survey/result" element={<SurveyResult />} />
          <Route path="upload" element={<VideoUpload />} />
          <Route path="analysis/result" element={<AnalysisResult />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="password/confirm" element={<PasswordConfirm />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          <Route path="password/change" element={<PasswordChange />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="history" element={<History />} />
          <Route path="history/all" element={<HistoryAll />} />
          <Route path="history/:analysisId" element={<HistoryDetail />} />
          <Route path="records" element={<Records />} />
          <Route path="community" element={<Community />} />
          <Route path="community/write" element={<CommunityWrite />} />
          <Route path="community/post/:id" element={<CommunityPost />} />
          <Route path="find-account" element={<FindAccount />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/docs" element={<DocsExport />} />
        <Route path="/storyboard" element={<Storyboard />} />
      </Routes>
    </BrowserRouter>
  );
}