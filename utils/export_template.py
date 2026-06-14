import os
import shutil
import subprocess

# Tên thư mục Template sẽ được sinh ra
TEMPLATE_DIR = "AntiGravity_Agent_Framework_Template"

# Thư mục hiện tại (utils/)
utils_dir = os.path.dirname(os.path.abspath(__file__))
# Thư mục gốc dự án (AntiGravity_Agent_Framework)
SOURCE_DIR = os.path.dirname(utils_dir)

# Danh sách các thư mục/file rác CẦN BỎ QUA khi copy
IGNORE_PATTERNS = shutil.ignore_patterns(
    "__pycache__",
    "*.pyc",
    "Memory",           # Bỏ qua bộ nhớ Agent cũ
    "Inputs",           # Fix #4: Bỏ qua Inputs để không copy tài liệu project cũ sang template
    "Outputs",          # Bỏ qua file render cũ
    "Legacy*",          # Bỏ qua các file Legacy
    "Reverse*",         # Bỏ qua các file dịch ngược
    "Ghost*",           # Bỏ qua các file Ghost
    "logs",             # Bỏ qua log cũ
    ".DS_Store",
)

def install_skills(template_path):
    """
    Tự động cài đặt chuyên gia (Agent Skills) vào thư mục .agents/skills của bản Boilerplate.
    """
    print("🛠️ Bắt đầu tải và tiêm kỹ năng (Skills) của các Chuyên gia vào Template...")
    skills_dir = os.path.join(template_path, ".agents", "skills")
    os.makedirs(skills_dir, exist_ok=True)

    # Lệnh git clone song song (sử dụng bash)
    clone_cmd = f"""
    cd "{skills_dir}" && \\
    git clone https://github.com/google-labs-code/stitch-skills.git && \\
    git clone https://github.com/sickn33/antigravity-awesome-skills.git && \\
    mv stitch-skills/* . && mv antigravity-awesome-skills/skills/ui-ux-pro-max . && \\
    rm -rf stitch-skills antigravity-awesome-skills skills CONTRIBUTING.md LICENSE README.md SECURITY.md
    """
    
    try:
        subprocess.run(clone_cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("✅ Đã tiêm thành công bộ Skills: @ui-ux-pro-max, @react-components, @stitch-loop, ...")
    except subprocess.CalledProcessError as e:
        print(f"❌ Lỗi khi tải Skills: {e}")


def create_template():
    # Template sẽ được thả ở ngoài vị trí của Anti_Gravity_Project
    template_path = os.path.join(os.path.dirname(SOURCE_DIR), TEMPLATE_DIR)
    
    print(f"🔄 Đang tạo Template rỗng tại: {template_path}")
    
    # Nếu đã có folder template từ trước -> Xóa đi làm lại
    if os.path.exists(template_path):
        shutil.rmtree(template_path)
        
    # Copy toàn bộ cấu trúc (trừ các file rớt vào mục báo qua)
    shutil.copytree(SOURCE_DIR, template_path, ignore=IGNORE_PATTERNS)
    
    # Đi một vòng (Walk) để tạo lại các Folder trống cần thiết nhưng bị bỏ qua ở trên
    # Ví dụ: Folder Memory, Inputs, Outputs cần tồn tại nhưng phải trống trơn
    agents = ["01_Analyst", "02_Architect", "03_Developer", "04_QA_Reviewer", "05_Final_Doc"]
    for agent in agents:
        agent_path = os.path.join(template_path, agent)
        os.makedirs(os.path.join(agent_path, "Memory"), exist_ok=True)
        # Tất cả các Agent đều cần Outputs để xuất file .md
        os.makedirs(os.path.join(agent_path, "Outputs"), exist_ok=True)
        
        # AG-05 cũng cần Inputs để gom .md outputs từ các Agent khác
        os.makedirs(os.path.join(agent_path, "Inputs"), exist_ok=True)

    # Kích hoạt cài skill
    install_skills(template_path)

    print("✅ HOÀN TẤT! Đã đóng gói xong Boilerplate Template.")
    print("👉 Hướng dẫn sử dụng cho Dự Án Mới:")
    print(f"Bước 1: Copy folder lưu ra chỗ khác và đổi tên (Ví dụ: `cp -r {TEMPLATE_DIR} ../Project_Shopee`)")
    print(f"Bước 2: Ném file yêu cầu khách hàng vào `01_Analyst/Inputs`")
    print(f"Bước 3: Chạy `python utils/orchestrator.py`")

if __name__ == "__main__":
    create_template()

