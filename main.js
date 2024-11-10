class School {
    constructor(name, address, city){
        this.name = name;
        this.address = address;
        this.city = city;
        this.students = [];
        this.teachers = [];
        this.subjects = [];
    }

    addTeacher(teacher){
        this.teachers.push(teacher);
    }
    
    addStudent(student){
        this.students.push(student);
    }

    addSubject(subject){
        this.subjects.push(subject);
    }

    fireTeacher(teacher){
        let teacherIndex = this.teachers.indexOf(teacher);
        if(teacherIndex > -1){
            this.teachers.splice(teacherIndex, 1);
            teacher.subjects.forEach(subject => {
                subject.removeTeacher();
                
            });
        }
    }

    relegateStudent(student){
        let index = this.students.indexOf(student);
        if (index > -1){
            this.students.splice(index, 1);
            student.subjects.forEach(subject => {
                subject.removeStudent(student);
            });
        }
    }

}


class Student {
    constructor(name, age){
        this.name = name;
        this.age = age;
        this.subjects = [];
        this.grades = [];
    }

    addSubject(subject){
        this.subjects.push(subject);
        subject.addStudent(this);
    }

    quitSubject(subject){
        let subjectIndex = this.subjects.indexOf(subject);
        if(subjectIndex > -1){
            this.subjects.splice(subjectIndex, 1);
            subject.removeStudent(this);
        }
    }

    addGrade(grade) {
        this.grades.push(grade); // Lägger till betyget i studentens lista
    }
    
    displayAllGrades() {
        return this.grades.map(grade => grade.displayGrade()).join("\n");
    }
}



class Teacher {
    constructor(name){
        this.name = name;
        this.subjects = [];
    }

    addSubject(subject){
        this.subjects.push(subject);
        subject.teacher = this;
    }

    removeSubject(subject) {
        let index = this.subjects.indexOf(subject);
        if (index > -1) {
            this.subjects.splice(index, 1);   // Ta bort ämnet från lärarens lista
            subject.teacher = null;           // Ta bort läraren från ämnet
        }
    }

    giveGrade(student, subject, gradeValue) {
        if (!this.subjects.includes(subject)) {
            console.log(`${this.name} is not assigned to teach ${subject.name}.`);
            return;
        }
        const grade = new Grade(subject, this, student, gradeValue);
        student.addGrade(grade);
        console.log(`Grade ${gradeValue} given to ${student.name} in ${subject.name} by ${this.name}.`);
        return grade;
    }
}

// Klass för Subject
class Subject {
    constructor(name) {
        this.name = name;
        this.students = []; // Tom array för studenter
        this.teacher = null; // Lärare börjar som null
    }

    addStudent(student) {
        this.students.push(student); // Lägg till studenten i ämnets lista
        if (!student.subjects.includes(this)) { // Kontroll för att undvika dubbletter
            student.subjects.push(this); // Lägg till ämnet i studentens lista om det saknas
        }
    }

    addTeacher(teacher) {
        this.teacher = teacher; // Sätt läraren till ämnet
        if (!teacher.subjects.includes(this)) {
            teacher.subjects.push(this); // Lägg till ämnet till lärarens lista om det saknas
        }
    }

    removeTeacher(teacher){
        if(this.teacher){
            let teacherIndex = this.teacher.subjects.indexOf(this);
            if (teacherIndex > -1){
                this.teacher.subjects.splice(teacherIndex, 1);

            }
            this.teacher = null;

        }
    }

    removeStudent(student){
        let studentIndex = this.students.indexOf(student);
        if(studentIndex > -1){
            this.students.splice(studentIndex, 1);
            student.quitSubject(this);
        }
    }

    assignGrade(student, teacher, gradeValue) {
        if (!this.teachers.includes(teacher)) {
            console.log(`${teacher.name} is not assigned to ${this.name}.`);
            return;
        }
        const grade = new Grade(this, teacher, student, gradeValue);
        student.addGrade(grade);
        return grade;
    }
}



// Grade-klassen
class Grade {
    constructor(subject, teacher, student, grade) {
        this.subject = subject;
        this.teacher = teacher;
        this.student = student;
        this.grade = grade;
        
    }
    
    updateGrade(newGrade) {
        this.grade = newGrade;
        console.log(`Grade updated to ${newGrade} for ${this.student.name} in ${this.subject.name}.`);
    }
    
    displayGrade() {
        return `Grade: ${this.grade}, Subject: ${this.subject.name}, Teacher: ${this.teacher.name}, Student: ${this.student.name}`;
    }
}


// Instansiering av skola, lärare, studenter och ämnen
const mySchool = new School("Code Academy");

const student1 = new Student("Alice", 20);
const student2 = new Student("Bob", 22);
const student3 = new Student("Charlie", 19);
const student4 = new Student("Diana", 21);
const student5 = new Student("Edward", 23);

const teacher1 = new Teacher("Anna");
const teacher2 = new Teacher("Bjorn");
const teacher3 = new Teacher("Niklas");

const math = new Subject("Math");
const programming = new Subject("Programming");
const history = new Subject("History");

// Lägg till studenter i skolan
mySchool.addStudent(student1);
mySchool.addStudent(student2);
mySchool.addStudent(student3);
mySchool.addStudent(student4);
mySchool.addStudent(student5);

// Lägg till lärare i skolan
mySchool.addTeacher(teacher1);
mySchool.addTeacher(teacher2);
mySchool.addTeacher(teacher3);

// Lägg till ämnen i skolan
mySchool.addSubject(math);
mySchool.addSubject(programming);
mySchool.addSubject(history);

// Koppla studenter till ämnen
student1.addSubject(math);
student2.addSubject(programming);
student3.addSubject(history);
student4.addSubject(math);
student5.addSubject(programming);

// Koppla lärare till ämnen
teacher1.addSubject(math);
teacher2.addSubject(programming);
teacher3.addSubject(history);


// set grade
teacher1.giveGrade(student1, math, "A");
teacher2.giveGrade(student2, programming, "B");
teacher3.giveGrade(student3, history, "C");




console.log("Skola:", mySchool);
console.log("Lärare 1 ämnen:", teacher1.subjects);
console.log("Student 1 ämnen:", student1.subjects);
console.log("Ämne 1 studenter:", math.students);
console.log("Ämne 1 lärare:", math.teacher);



//display grade 
console.log(student1.displayAllGrades());
console.log(student2.displayAllGrades());
console.log(student3.displayAllGrades());

//Display AllStudents
function displayAllStudents(){
    console.log("List of all students in the school:");
    for (let student of mySchool.students) {
        console.log(`Name: ${student.name}, Age: ${student.age}`);
    }
}

displayAllStudents();



//display AllsubjectsOfstudents

function displayAllSubjectsOfStudent(student) {
    if (!student.subjects || student.subjects.length === 0) {
        console.log(`${student.name} is not enrolled in any subjects.`);
        return [];
    }

    console.log(`Subjects for ${student.name}:`);
    const subjectNames = student.subjects.map(subject => subject.name);
    console.log(subjectNames.join(", "));
    return subjectNames;
}

displayAllSubjectsOfStudent(student2);


// display All teachers in the school
function displayAllTeachers() {
    let teacherNames = mySchool.teachers.map(teacher => teacher.name);
    console.log("All teachers in the school: " + teacherNames.join(", "));
    return teacherNames;
}
displayAllTeachers();


// Funktion som visar alla studenter registrerade i ett visst ämne
function displayAllStudentsEnlistedToSubject(subject) {
    let students = subject.students.map(student => student.name);
    console.log(`Students enrolled in ${subject.name}: ${students.join(", ")}`);
    return students;
}
displayAllStudentsEnlistedToSubject(programming);


