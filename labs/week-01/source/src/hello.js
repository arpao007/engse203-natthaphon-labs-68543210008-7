const student = {
  name: "นายณัฐพล แซ่วั่ง",
  studentId: "68543210008-7",
  os: process.platform,
  node: process.version,
};

function createGreeting({ name, studentId, os, node }) {
  return `Hello ${name} (${studentId}) | OS: ${os} | Node: ${node}`;
}

console.log(createGreeting(student));