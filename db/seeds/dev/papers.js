exports.seed = async function (knex) {
  //default
  // // Deletes ALL existing entries
  // return knex('table_name').del()
  //   .then(function () {
  //     // Inserts seed entries
  //     return knex('table_name').insert([
  //       {id: 1, colName: 'rowValue1'},
  //       {id: 2, colName: 'rowValue2'},
  //       {id: 3, colName: 'rowValue3'}
  //     ]);
  //   });
  try {
    await knex("footnotes").del();
    await knex("papers").del();
    const paperId = await knex("papers").insert(
      {
        title: "Fooo",
        author: "Bob",
        publisher: "Minnesota",
      },
      "id"
    );
    return knex("footnotes").insert([
      { note: "Lorem", paper_id: paperId[0] },
      { note: "Dolor", paper_id: paperId[0] },
    ]);
  } catch (error) {
    console.log(`Error seeding data: ${error}`);
  }
};
