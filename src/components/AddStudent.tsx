import React, { useEffect }  from "react"
import "./AddStudent.css"
interface Student {
    name: string;
    dateOfBirth:string;
    email: string;
    id: number;
    status: string;
}

export default function AddStudent() {
    const [student,setStudent] =React.useState<Student>({
        id: 0,
        name: "",
        email: "",
        dateOfBirth: "",
        status: "Đang hoạt động"
    })
    const [students, setStudents] = React.useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = React.useState<Student[]>([]);
    const [showForm,setShowForm] = React.useState<boolean>(false)
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = React.useState<string>("");
    const [showBlockModal, setShowBlockModal] = React.useState<boolean>(false); // Trạng thái của modal chặn
    const [blockStudentId, setBlockStudentId] = React.useState<number | null>(null); // ID của sinh viên cần chặn
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [sortOrder, setSortOrder] = React.useState<string>("");
    useEffect(() => {
        const savedStudents = localStorage.getItem("students");
        if (savedStudents) {
            const parsedStudents = JSON.parse(savedStudents);
            setStudents(parsedStudents);
            setFilteredStudents(parsedStudents);
        }
    }, []);

    const handleClick = () => {
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setErrors({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent!,
            [name]: value
        }));
    };
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!student.id) newErrors.id = "Mã sinh viên không được để trống";
        if (!student.name) newErrors.name = "Tên sinh viên không được để trống";
        if (!student.email) {
            newErrors.email = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(student.email)) {
            newErrors.email = "Email không đúng định dạng";
        }

        const isDuplicateId = students.some(s => s.id === student.id);
        if (isDuplicateId) newErrors.id = "Mã sinh viên không được phép trùng";

        const isDuplicateEmail = students.some(s => s.email === student.email);
        if (isDuplicateEmail) newErrors.email = "Email không được phép trùng";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleAddStudent = () => {
        if (validate()) {
            const updatedStudents = [...students, student];
            setStudents(updatedStudents);
            localStorage.setItem("students", JSON.stringify(updatedStudents));
            setFilteredStudents(updatedStudents);
            setShowForm(false);
            setStudent({
                id: 0,
                name: "",
                email: "",
                dateOfBirth: "",
                status: "Đang hoạt động"
            });
            setErrors({});
            setSuccessMessage("Thêm tài khoản thành công!");
            setTimeout(() => {
                setSuccessMessage("");
            }, 1000);
        }
    };
    
    const handleDeleteStudent = (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên này không?");
        if (confirmDelete) {
            const updatedStudents = students.filter(student => student.id !== id);
            setStudents(updatedStudents);
            localStorage.setItem("students", JSON.stringify(updatedStudents));
            setFilteredStudents(updatedStudents);
        }
    };
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);
        filterStudents(value, sortOrder);
    };
    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setSortOrder(value);
        filterStudents(searchTerm, value);
    };
    const filterStudents = (searchTerm: string, sortOrder: string) => {
        let filtered = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortOrder === "asc") {
            filtered.sort((a, b) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime());
        } else if (sortOrder === "desc") {
            filtered.sort((a, b) => new Date(b.dateOfBirth).getTime() - new Date(a.dateOfBirth).getTime());
        }

        setFilteredStudents(filtered);
    };
    
    // const openBlockModal = (id: number) => {
    //     setBlockStudentId(id);
    //     setShowBlockModal(true);
    // };

    // const closeBlockModal = () => {
    //     setBlockStudentId(null);
    //     setShowBlockModal(false);
    // };
    
    // const handleBlockStudent = () => {
    //     if (blockStudentId !== null) {
    //         const updatedStudents = students.map(student =>
    //             student.id === blockStudentId ? { ...student, status: "Đã chặn" } : student
    //         );
    //         setStudents(updatedStudents);
    //         localStorage.setItem("students", JSON.stringify(updatedStudents));
    //         setFilteredStudents(updatedStudents);
    //         closeBlockModal();
    //     }
    // };




  return (
    <div className="header">
        
        <div> <button onClick={handleClick} className="header-item" >Thêm mới sinh viên</button></div>
        
        {showForm && (
                <div className="modal-overlay">
                   
                        <form className="form" onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }}>
                            <div className="form-group">
                                <label>Mã sinh viên:</label>
                                <input type="number" name="id" value={student.id} onChange={handleChange} />
                                {errors.id && <span className="error">{errors.id}</span>}
                            </div>
                            <div className="form-group">
                                <label>Tên sinh viên:</label>
                                <input type="text" name="name" value={student.name} onChange={handleChange} />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" value={student.email} onChange={handleChange} />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh:</label>
                                <input type="date" name="dateOfBirth" value={student.dateOfBirth} onChange={handleChange} />
                            </div>
                            <div className="form-actions">
                                <button type="submit">Thêm mới</button>
                                <button type="button" onClick={handleClose}>Đóng</button>
                            </div>
                        </form>
                    </div>
                
            )}
               {showBlockModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        {/* <div className="form-actions">
                            <button onClick={handleBlockStudent}>Chặn</button>
                            <button onClick={closeBlockModal}>Hủy</button>
                        </div> */}
                    </div>
                </div>
            )}
               {successMessage && (
                <div className="success-overlay">
                    <div className="success-modal">
                        {successMessage}
                    </div>
                </div>
                )}
                <div className="controls">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sinh viên..." 
                        value={searchTerm}  
                        onChange={handleSearch} 
                        className="search-input"
                    />
                    <select value={sortOrder} onChange={handleSort} className="sort-select">
                        <option value="">Sắp xếp theo tuổi</option>
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
                <div className="student-list">
                    <h2>Danh sách sinh viên</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Mã sinh viên</th>
                                <th scope="col">Tên sinh viên</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Email</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{index + 1}</td>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                                    <td>{student.email}</td>
                                    <td>{student.status}</td>
                                    <td style={{ display: "flex", gap: "10px" }}>
                                    <button 
                                        style={{ backgroundColor: "blue", borderRadius: "5px", color: "white" }}
                                        // onClick={() => openBlockModal(student.id)}
                                    >
                                        Chặn
                                    </button>
                                        <button style={{ backgroundColor: "yellow", borderRadius: "5px" }}>Sửa</button>
                                        <button
                                            style={{ backgroundColor: "red", borderRadius: "5px", color: "white" }}
                                            onClick={() => handleDeleteStudent(student.id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>  

          
                
    </div>  
  )
}
