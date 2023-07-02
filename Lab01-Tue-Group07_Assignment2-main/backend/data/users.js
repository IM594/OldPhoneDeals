import bcrypt from "bcryptjs";

const users = [
  {
    _id: { $oid: "5f5237a4c1beb1523fa3da02" },
    firstname: "Anita",
    lastname: "Simpson",
    email: "anita.simpson@hooli.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    _id: { $oid: "5f5237a4c1beb1523fa3da03" },
    firstname: "Holli",
    lastname: "Moore",
    email: "holli.moore@outlook.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    _id: { $oid: "5f5237a4c1beb1523fa3da04" },
    firstname: "Robert",
    lastname: "Vasques",
    email: "robert.vasques@piedpiper.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    _id: { $oid: "5f5237a4c1beb1523fa3da05" },
    firstname: "Jimmy",
    lastname: "Sagedahl",
    email: "jimmy.sagedahl@hooli.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    _id: { $oid: "5f5237a4c1beb1523fa3da06" },
    firstname: "Tyler",
    lastname: "Martin",
    email: "tyler.martin@piedpiper.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
