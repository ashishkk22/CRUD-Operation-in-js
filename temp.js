const ak = /^[1-9][0-9]{4,20}$/;
const ak2 = "3452334";
console.log(ak.test(ak2));

const description = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]{10,200}$/;
const desString = "asfas sdfdsa asfd afda ";
console.log(description.test(desString));

const nameRegex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]{5,}$/;
const nameString = "dsfa sdfd af";
console.log(nameRegex.test(nameString));

const imgReg = /^([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))$/;
const stringImg = "asdfa.png";
console.log(imgReg.test(stringImg));
