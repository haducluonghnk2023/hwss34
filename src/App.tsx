import AddStudent from './components/AddStudent'
import Sort from './components/Sort'
import SearchStudent from './components/SearchStudent'
import Student from './components/Student'

export default function App() {
  return (
    <div>
        <div style={{justifyContent:"space-between",margin:"0 45px",display:"ruby-text"}}>
          <h2>Quản lí sinh viên</h2>
          <AddStudent></AddStudent>
        </div>
        <div style={{display:"flex",justifyContent:"end"}}>
          <Sort></Sort>
          <SearchStudent></SearchStudent>
        </div>
        <Student></Student>
        
    </div>
  )
}
