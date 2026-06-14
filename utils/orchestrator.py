import os
import time
import shutil
import argparse
from concurrent.futures import ThreadPoolExecutor  # S1: parallel phase
from typing import Optional
import logging
import re
from datetime import datetime

# ==========================================
# THE ORCHESTRATOR — KẺ ĐIỀU PHỐI
# Quản lý vòng đời (Lifecycle) và Token của các Agent
# Pipeline đầy đủ: AG-01 → AG-02 → AG-03 → AG-04 → AG-05
# ==========================================

# ── Cấu hình toàn cục (override bằng env var) ─────────────────────────────


# ── Cấu hình Agent toàn hệ thống ──────────────────────────────────────────
AGENT_CONFIG = {
    "AG-01": {"dir": "01_Analyst",     "role": "Business Analyst"},
    "AG-02": {"dir": "02_Architect",   "role": "System Architect"},
    "AG-03": {"dir": "03_Developer",   "role": "Developer"},
    "AG-04": {"dir": "04_QA_Reviewer", "role": "QA Reviewer"},
    "AG-05": {"dir": "05_Final_Doc",   "role": "Final Documenter"},
}


# ==========================================
# LOGGER TẬP TRUNG
# ==========================================
def setup_logger(base_dir: str) -> logging.Logger:
    """Khởi tạo bộ ghi log tập trung vào logs/ tại thư mục gốc."""
    logs_dir = os.path.join(base_dir, "logs")
    os.makedirs(logs_dir, exist_ok=True)

    log_filename = datetime.now().strftime("run_%Y%m%d_%H%M%S.log")
    log_path = os.path.join(logs_dir, log_filename)

    logger = logging.getLogger("AntiGravity")
    logger.setLevel(logging.DEBUG)
    # Tránh duplicate handler khi gọi setup_logger nhiều lần (ví dụ --reset)
    if logger.handlers:
        logger.handlers.clear()

    file_handler = logging.FileHandler(log_path, encoding="utf-8")
    file_handler.setLevel(logging.DEBUG)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    formatter = logging.Formatter(
        fmt="[%(asctime)s] [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    logger.info(f"📄 Log tập trung tại: {log_path}")
    return logger


def _console_logger() -> logging.Logger:
    """S2: Logger chỉ ghi ra console, không tạo file.
    Dùng cho pha --reset để tránh setup_logger tạo file rồi reset_workspace xóa mất.
    """
    log = logging.getLogger("AntiGravity.Bootstrap")
    if not log.handlers:
        h = logging.StreamHandler()
        h.setFormatter(logging.Formatter("[%(asctime)s] %(message)s", "%H:%M:%S"))
        log.addHandler(h)
    log.setLevel(logging.INFO)
    return log



# ==========================================
# AGENT SESSION
# ==========================================
class AgentSession:
    def __init__(self, agent_id: str, agent_role: str, working_dir: str, logger: logging.Logger):
        self.agent_id    = agent_id
        self.agent_role  = agent_role
        self.working_dir = working_dir
        self.logger      = logger

    def execute_task(self):
        """
        Stub thực thi một phase.
        Khi tích hợp LLM thật, thay thế bằng:
            response = llm_client.chat(...)
        """
        self.logger.info(f"[{self.agent_id}] ▶ Bắt đầu: {self.agent_role}")
        time.sleep(0.3)  # placeholder — thay bằng LLM call thật
        self.logger.info(f"[{self.agent_id}] ✅ Hoàn tất phase.\n")


# ==========================================
# HUMAN CHECKPOINT
# ==========================================
def human_checkpoint(
    message: str,
    logger: logging.Logger,
    save_dir: Optional[str] = None,
) -> str:
    """
    Tạm dừng pipeline, yêu cầu PM tương tác.
    Fix #6: Nếu save_dir được cung cấp, input của PM được lưu thành
    PM_Request_{timestamp}.md để Agent đọc lại trong session tiếp theo.
    """
    logger.info(f"\n{'='*60}")
    logger.info(f"🛑 [HUMAN CHECKPOINT] {message}")
    logger.info(f"{'='*60}")

    user_input = input("👉 PM, hãy nhập yêu cầu của bạn rồi nhấn Enter:\n> ").strip()
    logger.info(f"[HUMAN CHECKPOINT] PM đã nhập: {user_input}")

    if save_dir and user_input:
        os.makedirs(save_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_path = os.path.join(save_dir, f"PM_Request_{timestamp}.md")
        with open(save_path, "w", encoding="utf-8") as f:
            f.write(f"# PM Request — {timestamp}\n\n{user_input}\n")
        logger.info(f"💾 PM Request đã lưu vào: {save_path}")

    logger.info(f"{'='*60}\n")
    return user_input


# ==========================================
# TASK-LEVEL CHECKPOINT (sau mỗi task Sprint 2)
# ==========================================
def task_checkpoint(
    scenario: int,
    task_id: str,
    task_desc: str,
    logger: logging.Logger,
    changelog_path: Optional[str] = None,
) -> str:
    """
    Dừng pipeline sau khi AG-03 hoàn thành MỘT task.
    Hiển thị task ID + mô tả, hỏi PM:
      - ENTER / 'ok' / 'approve': tiếp tục task kế tiếp
      - 'reject' / 'fix' + ghi chú: ghi PM note vào Changelog rồi dừng toàn sprint
      - 'skip': bỏ qua task kế tiếp (hiếm dùng)
    """
    bar = "─" * 60
    logger.info(f"\n{bar}")
    logger.info(f"✅ [TASK DONE] [{task_id}] {task_desc}")
    logger.info(f"   Kịch bản: {scenario}")
    if changelog_path and os.path.exists(changelog_path):
        logger.info(f"   Changelog: {changelog_path}")
    logger.info(f"{bar}")
    logger.info("👉 PM review task trên rồi chọn:")
    logger.info("   [Enter / ok / approve]  → Chấp thuận, tiếp tục task kế tiếp")
    logger.info("   [reject <ghi chú>]      → Từ chối, dừng Sprint để AG-03 sửa lại")
    logger.info("   [skip]                  → Bỏ qua — task kế tiếp sẽ bị skip")
    logger.info(f"{bar}")

    raw = input("> ").strip()
    decision = raw.lower().split()[0] if raw else "ok"
    note = raw[len(decision):].strip() if raw else ""

    if decision in ("", "ok", "approve"):
        logger.info(f"   ↳ PM approved [{task_id}] — tiếp tục.\n")
        if changelog_path:
            _append_changelog(changelog_path, task_id, "APPROVED", note)
        return "approved"

    if decision in ("reject", "fix"):
        msg = note or "(PM không để lại ghi chú)"
        logger.warning(f"   ↳ PM YÊU CẦU SỬA [{task_id}]: {msg}")
        logger.warning("   Pipeline Sprint 2 TẠM DỪNG — AG-03 cần xem lại Changelog.md")
        if changelog_path:
            _append_changelog(changelog_path, task_id, "REJECTED", msg)
        return "rejected"

    if decision == "skip":
        logger.info(f"   ↳ PM bỏ qua [{task_id}].\n")
        if changelog_path:
            _append_changelog(changelog_path, task_id, "SKIPPED", note)
        return "skipped"

    logger.info(f"   ↳ Input không rõ ('{raw}') → coi như approved.\n")
    return "approved"


def _append_changelog(path: str, task_id: str, status: str, note: str):
    """Ghi thêm 1 dòng PM review vào Changelog.md của AG-03."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"\n| {timestamp} | {task_id} | {status} | {note or '-'} |"
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)


def read_task_list(base_dir: str, logger: logging.Logger) -> list:
    """
    Đọc Implementation_Plan.md của AG-03 để lấy danh sách Task ID.
    Tìm các dòng có pattern: | Sn-xx-NN | ... | (Task ID column).
    Trả về list of (task_id, description).
    """
    plan_path = os.path.join(base_dir, "03_Developer", "Outputs", "Implementation_Plan.md")
    if not os.path.exists(plan_path):
        logger.warning(f"⚠️  Không tìm thấy {plan_path} — task checkpoint sẽ dùng placeholder.")
        return [("TASK-001", "Task đầu tiên (không parse được Plan)")]

    tasks = []
    pattern = re.compile(r"^\|\s*(S\d+-[\w-]+)\s*\|(.+?)\|")
    with open(plan_path, "r", encoding="utf-8") as f:
        for line in f:
            m = pattern.match(line.strip())
            if m:
                task_id = m.group(1).strip()
                desc    = m.group(2).strip()
                tasks.append((task_id, desc))

    if not tasks:
        logger.warning("⚠️  Implementation_Plan.md không có Task ID dạng S1-M1-T01 — dùng placeholder.")
        tasks = [("TASK-001", "(Không parse được — PM kiểm tra thủ công)")]

    logger.info(f"📋 Đọc được {len(tasks)} task(s) từ Implementation_Plan.md")
    return tasks


def sprint2_task_loop(
    scenario: int,
    base_dir: str,
    logger: logging.Logger,
    _run,
    _gate_task,
):
    """
    Vòng lặp Sprint 2: với mỗi task trong Implementation_Plan,
    spawn AG-03 → đợi AG-03 báo xong → task_checkpoint → tiếp hoặc dừng.
    """
    tasks = read_task_list(base_dir, logger)
    changelog_path = os.path.join(
        base_dir, "03_Developer", "Outputs", "Changelog.md"
    )

    # Đảm bảo Changelog.md có header bảng PM review
    if not os.path.exists(changelog_path):
        os.makedirs(os.path.dirname(changelog_path), exist_ok=True)
        with open(changelog_path, "w", encoding="utf-8") as f:
            f.write("# Changelog — AG-03 Sprint 2\n\n")
            f.write("| Thời gian | Task ID | PM Status | Ghi chú PM |\n")
            f.write("|-----------|---------|-----------|------------|\n")

    for task_id, task_desc in tasks:
        logger.info(f"\n→ Bắt đầu [{task_id}] {task_desc}")
        _run("AG-03", base_dir, logger)  # AG-03 thực hiện đúng 1 task

        decision = _gate_task(
            scenario=scenario,
            task_id=task_id,
            task_desc=task_desc,
            logger=logger,
            changelog_path=changelog_path,
        )

        if decision == "rejected":
            logger.warning(
                f"🛑 Sprint 2 tạm dừng tại [{task_id}].\n"
                "   AG-03 phải đọc Changelog.md, sửa lại rồi PM restart pipeline."
            )
            return False  # Dừng toàn sprint

    logger.info("✅ Tất cả task Sprint 2 đã được PM approve.\n")
    return True


# ==========================================
# KANBAN AUTO-UPDATE
# ==========================================
def update_kanban_phase(content: str, phase_heading: str, new_status: str) -> str:
    """Tìm heading Phase và thay thế dòng Trạng thái ngay sau nó."""
    lines = content.split("\n")
    result = []
    i = 0
    while i < len(lines):
        result.append(lines[i])
        if phase_heading in lines[i]:
            i += 1
            if i < len(lines) and "**Trạng thái:**" in lines[i]:
                result.append(f"**Trạng thái:** {new_status}")
                i += 1
                continue
        i += 1
    return "\n".join(result)


def update_execution_plan(base_dir: str, scenario: int, logger: logging.Logger):
    """Đọc EXECUTION_PLAN_TEMPLATE.md → sinh/cập nhật Documents/EXECUTION_PLAN.md."""
    template_path = os.path.join(base_dir, "Documents", "EXECUTION_PLAN_TEMPLATE.md")

    plan_path = os.path.join(base_dir, "Documents", "EXECUTION_PLAN.md")

    if not os.path.exists(plan_path):
        if not os.path.exists(template_path):
            logger.error("❌ Không tìm thấy EXECUTION_PLAN_TEMPLATE.md trong Documents/!")
            return
        with open(template_path, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        with open(plan_path, "r", encoding="utf-8") as f:
            content = f.read()

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    content = re.sub(
        r"\*\*Lần cập nhật cuối:\*\*.*",
        f"**Lần cập nhật cuối:** {now_str} (Tự động bởi Orchestrator)",
        content,
    )

    # Reset tick cũ
    content = content.replace("[x] Task 0.A", "[ ] Task 0.A")
    content = content.replace("[x] Task 0.B", "[ ] Task 0.B")
    content = content.replace("[x] Option A", "[ ] Option A")
    content = content.replace("[x] Option B", "[ ] Option B")

    if scenario == 1:
        logger.info("🚀 Kịch bản 1: GREENFIELD")
        content = update_kanban_phase(content, "GIAI ĐOẠN 0", "⏭️  Bỏ qua — Dự án Greenfield mới 100%")
        content = update_kanban_phase(content, "GIAI ĐOẠN 1", "⏳ Đang xử lý")
    elif scenario == 2:
        logger.info("🛠️  Kịch bản 2: MAINTENANCE")
        content = content.replace("[ ] Option A", "[x] Option A")
        content = content.replace("[ ] Task 0.A", "[x] Task 0.A")
        content = update_kanban_phase(content, "GIAI ĐOẠN 0", "⏳ Đang xử lý — Option A")
    elif scenario == 3:
        logger.info("🏗️  Kịch bản 3: REFACTORING")
        content = content.replace("[ ] Option B", "[x] Option B")
        content = content.replace("[ ] Task 0.B", "[x] Task 0.B")
        content = update_kanban_phase(content, "GIAI ĐOẠN 0", "⏳ Đang xử lý — Option B")

    with open(plan_path, "w", encoding="utf-8") as f:
        f.write(content)

    logger.info(f"✔️  Kanban cập nhật → Documents/EXECUTION_PLAN.md ({now_str})")


# ==========================================
# FIX #7: RESET WORKSPACE
# ==========================================
def reset_workspace(base_dir: str, logger: logging.Logger):
    """Xóa Memory/, Outputs/, logs/ và Documents/EXECUTION_PLAN.md để chạy lại từ đầu."""
    logger.info("🔄 Reset workspace bắt đầu...")

    for agent_id, cfg in AGENT_CONFIG.items():
        agent_dir = os.path.join(base_dir, cfg["dir"])
        for folder in ["Memory", "Outputs"]:
            path = os.path.join(agent_dir, folder)
            if os.path.exists(path):
                shutil.rmtree(path)
                os.makedirs(path, exist_ok=True)
                logger.info(f"🗑️  Reset: {path}")

    plan_path = os.path.join(base_dir, "Documents", "EXECUTION_PLAN.md")
    if os.path.exists(plan_path):
        os.remove(plan_path)
        logger.info("🗑️  Reset: Documents/EXECUTION_PLAN.md")

    logs_dir = os.path.join(base_dir, "logs")
    if os.path.exists(logs_dir):
        shutil.rmtree(logs_dir)
        logger.info("🗑️  Reset: logs/")

    logger.info("✅ Workspace đã reset sạch. Sẵn sàng chạy lại.\n")


# ==========================================
# HELPER: CHẠY MỘT PHASE
# ==========================================
def run_phase(agent_id: str, base_dir: str, logger: logging.Logger) -> bool:
    """Spawn 1 AgentSession và execute task. Trả về True nếu hoàn tất."""
    cfg = AGENT_CONFIG[agent_id]
    agent_dir = os.path.join(base_dir, cfg["dir"])
    agent = AgentSession(agent_id, cfg["role"], agent_dir, logger)
    agent.execute_task()
    return True


# ==========================================
# ORCHESTRATOR LOOP CHÍNH
# S1: parallel S3 | S5: dry-run | S6: inputs guard
# ==========================================
def orchestrator_loop(scenario: int, dry_run: bool = False):
    utils_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir  = os.path.dirname(utils_dir)
    logger    = setup_logger(base_dir)

    # S5 ── Dry-run mode: aliases không thật, không block ───────────────────
    if dry_run:
        logger.info("🔍 [DRY-RUN] Chế độ preview — không spawn Agent, không dừng tại Checkpoint.")
        _run       = lambda agent_id, *a, **kw: logger.info(f"    ↳ [DRY-RUN] Skip spawn {agent_id}") or True
        _gate      = lambda msg, *a, **kw:      logger.info(f"    ↳ [DRY-RUN] Skip checkpoint: {msg.splitlines()[0]}") or ""
        _gate_task = lambda **kw:               logger.info(f"    ↳ [DRY-RUN] Skip task-checkpoint: {kw.get('task_id', '?')} — {kw.get('task_desc', '')}") or "approved"
    else:
        _run       = run_phase
        _gate      = human_checkpoint
        _gate_task = task_checkpoint

    # S6 ── Inputs guard: kiểm tra thư mục input trước khi chạy ─────────────
    if not dry_run:
        if scenario in (1, 3):
            inputs_dir = os.path.join(base_dir, "01_Analyst", "Inputs")
            os.makedirs(inputs_dir, exist_ok=True)
            docs = [f for f in os.listdir(inputs_dir)
                    if not f.startswith(".") and not f.endswith(".gitkeep")]
            if not docs:
                logger.error(
                    "❌ 01_Analyst/Inputs/ đang trống — không thể chạy pipeline!\n"
                    f"   → Ném SRS/BRD (.docx/.pdf/.md/.txt) vào: {inputs_dir}"
                )
                return
        elif scenario == 2:
            inputs_dir = os.path.join(base_dir, "03_Developer", "Inputs")
            os.makedirs(inputs_dir, exist_ok=True)
            files = [f for f in os.listdir(inputs_dir)
                     if not f.startswith(".") and not f.endswith(".gitkeep")]
            if not files:
                logger.error(
                    "❌ 03_Developer/Inputs/ đang trống — không thể chạy Scenario 2!\n"
                    f"   → Ném source code cũ vào: {inputs_dir}"
                )
                return

    update_execution_plan(base_dir, scenario, logger)

    logger.info(f"\n{'='*60}")
    label = f"KỊCH BẢN {scenario}" + ("  [DRY-RUN]" if dry_run else "")
    logger.info(f"🤖 ANTI-GRAVITY PIPELINE — {label}")
    logger.info(f"{'='*60}\n")

    # ── KỊCH BẢN 1: GREENFIELD ─────────────────────────────────────────────
    if scenario == 1:
        logger.info("─── Phase 1: AG-01 phân tích tài liệu đầu vào ───")
        _run("AG-01", base_dir, logger)

        logger.info("─── Phase 2: AG-02 thiết kế hệ thống ───")
        _run("AG-02", base_dir, logger)

        _gate(
            "AG-02 hoàn thành System Design.\n"
            "  → Review 02_Architect/Outputs/ rồi xác nhận để tiếp tục.",
            logger,
        )

        logger.info("─── Phase 3 Sprint 1: AG-03 lập Implementation Plan ───")
        _run("AG-03", base_dir, logger)

        _gate(
            "AG-03 đã lập Implementation Plan trong 03_Developer/Outputs/[Module]/.\n"
            "  → Phê duyệt Plan trước khi AG-03 bắt đầu code.",
            logger,
        )

        logger.info("─── Phase 3 Sprint 2: AG-03 code theo Module — Task-by-Task Checkpoint ───")
        ok = sprint2_task_loop(scenario, base_dir, logger, _run, _gate_task)
        if not ok:
            return

        logger.info("─── Phase 4: AG-04 Unit Test + Security Scan ───")
        _run("AG-04", base_dir, logger)

        logger.info("─── Phase 5: AG-05 xuất Final Report ───")
        _run("AG-05", base_dir, logger)

    # ── KỊCH BẢN 2: MAINTENANCE ────────────────────────────────────────────
    elif scenario == 2:
        logger.info("─── Phase 0A: AG-02 đọc legacy code → Legacy_Architecture.md ───")
        _run("AG-02", base_dir, logger)

        pm_inputs_dir = os.path.join(base_dir, "01_Analyst", "Inputs")
        _gate(
            "AG-02 đã xuất Legacy_Architecture.md.\n"
            "  → Nhập yêu cầu tính năng mới hoặc bug cần fix:\n"
            f"    (Sẽ tự lưu vào {pm_inputs_dir}/PM_Request_*.md)",
            logger,
            save_dir=pm_inputs_dir,
        )

        logger.info("─── Phase 1: AG-01 phân tích yêu cầu PM + legacy context ───")
        _run("AG-01", base_dir, logger)

        logger.info("─── Phase 2: AG-02 thiết kế Patch Plan ───")
        _run("AG-02", base_dir, logger)

        _gate(
            "AG-02 hoàn thành Patch Plan.\n"
            "  → Review 02_Architect/Outputs/ rồi phê duyệt để AG-03 patch code.",
            logger,
        )

        logger.info("─── Phase 3: AG-03 patch tuần tự theo Ticket — Task-by-Task Checkpoint ───")
        ok = sprint2_task_loop(scenario, base_dir, logger, _run, _gate_task)
        if not ok:
            return

        logger.info("─── Phase 4: AG-04 Regression Test + Security Scan ───")
        _run("AG-04", base_dir, logger)

        logger.info("─── Phase 5: AG-05 xuất Patch Report ───")
        _run("AG-05", base_dir, logger)

    # ── KỊCH BẢN 3: REFACTORING ────────────────────────────────────────────
    elif scenario == 3:
        # S1: AG-01 và AG-02 chạy THẬT SỰ song song bằng ThreadPoolExecutor
        logger.info("─── Phase 0B: AG-01 + AG-02 chạy SONG SONG ───")
        logger.info("    AG-02 → trích xuất Business Logic từ legacy code")
        logger.info("    AG-01 → đọc SRS mới (đồng thời)")
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_02 = executor.submit(_run, "AG-02", base_dir, logger)
            future_01 = executor.submit(_run, "AG-01", base_dir, logger)
            ok_02 = future_02.result()
            ok_01 = future_01.result()
        if not (ok_02 and ok_01):
            logger.error("❌ Phase 0B song song thất bại — dừng pipeline.")
            return

        logger.info("─── Phase 2: AG-02 cross-check SRS mới vs Business Logic cũ → Architecture mới ───")
        _run("AG-02", base_dir, logger)

        _gate(
            "AG-02 đã cross-check xong.\n"
            "  → Review 02_Architect/Outputs/ để đảm bảo KHÔNG mất logic nghiệp vụ cũ.",
            logger,
        )

        logger.info("─── Phase 3: AG-03 viết lại tuần tự theo Layer — Task-by-Task Checkpoint ───")
        ok = sprint2_task_loop(scenario, base_dir, logger, _run, _gate_task)
        if not ok:
            return

        logger.info("─── Phase 4: AG-04 Full Regression + Security Scan ───")
        _run("AG-04", base_dir, logger)

        logger.info("─── Phase 5: AG-05 xuất Migration Report ───")
        _run("AG-05", base_dir, logger)

    logger.info(f"\n{'='*60}")
    logger.info("🎉 PIPELINE HOÀN TẤT — Kiểm tra 05_Final_Doc/Outputs/ để lấy kết quả.")
    logger.info(f"{'='*60}\n")


# ==========================================
# ENTRY POINT
# ==========================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Anti-Gravity Multi-Agent Orchestrator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ví dụ:
  python utils/orchestrator.py --scenario 1                   # Greenfield
  python utils/orchestrator.py --scenario 2                   # Maintenance
  python utils/orchestrator.py --scenario 3                   # Refactoring
  python utils/orchestrator.py --reset --scenario 1           # Reset + chạy lại
  python utils/orchestrator.py --dry-run --scenario 3         # Preview, không spawn
        """,
    )
    parser.add_argument(
        "--scenario", type=int, choices=[1, 2, 3], default=1,
        help="1=Greenfield | 2=Maintenance | 3=Refactoring (mặc định: 1)",
    )
    parser.add_argument(
        "--reset", action="store_true",
        help="Xóa sạch Memory/, Outputs/, logs/ và Documents/EXECUTION_PLAN.md trước khi chạy",
    )
    parser.add_argument(
        "--dry-run", dest="dry_run", action="store_true",
        help="S5: Preview pipeline — in phases/checkpoints, không spawn Agent thật",
    )
    args = parser.parse_args()

    print("==== KHỞI ĐỘNG ANTI-GRAVITY ORCHESTRATOR ====\n")

    utils_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir  = os.path.dirname(utils_dir)

    if args.reset:
        # S2: dùng console-only logger để reset không tự xóa file log session hiện tại
        _boot = _console_logger()
        reset_workspace(base_dir, _boot)

    orchestrator_loop(args.scenario, dry_run=args.dry_run)
