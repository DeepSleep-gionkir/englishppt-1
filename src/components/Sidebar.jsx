import React from "react";
import {
  Plus,
  MessageSquare,
  FolderKanban,
  Sparkles,
  Code,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-area">
          <span className="sidebar-logo-text">Claude</span>
        </div>
        <button className="sidebar-collapse-btn">
          <div className="sidebar-collapse-icon"></div>
        </button>
      </div>

      {/* New Chat & Navigation */}
      <div className="sidebar-nav-scroll">
        <div className="sidebar-section main-nav">
          {/* New Chat Row */}
          <button className="nav-item new-chat-row">
            <div className="new-chat-icon-circle">
              <Plus size={14} color="#fff" strokeWidth={3} />
            </div>
            <span className="nav-text">새 채팅</span>
          </button>

          <NavItem icon={<MessageSquare size={18} />} label="채팅" />
          <NavItem icon={<FolderKanban size={18} />} label="프로젝트" />
          <NavItem icon={<Sparkles size={18} />} label="아티팩트" />
          <NavItem icon={<Code size={18} />} label="코드" />
        </div>

        {/* Recent History */}
        <div className="sidebar-section recent-section">
          <div className="section-title">최근 항목</div>
          <div className="recent-list">
            <div className="recent-item">Greeting</div>
            <div className="recent-item">영어 발표 오프닝 멘트 추천</div>
            <div className="recent-item">현재완료 시제 완벽 정리</div>
            <div className="recent-item">비즈니스 영어 이메일 작성법</div>
            <div className="recent-item">React 퍼포먼스 최적화</div>
            <div className="recent-item">Next.js 14 마이그레이션 가이드</div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">김</div>
          <div className="user-info">
            <span className="user-name">김은호</span>
            <span className="user-plan">무료 요금제</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <button className="nav-item">
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
