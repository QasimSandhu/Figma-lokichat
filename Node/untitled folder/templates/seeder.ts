import faker from "faker";
import templateName from "../../models/templateName";

export class templateNameSeeder {
  async seed(count = 10) {
    try {
      const entries:Array<object> = [];
      
      for (let i = 0; i < count; i++) {
        const entry:object = new templateName({
          name: faker.name.findName()
        });

        entries.push(entry);
      }

      await templateName.insertMany(entries);
      console.log(`${count} templateName seeded successfully!`);
    } catch (error) {
      console.error(error);
    }
  }

  async clear() {
    try {
      await templateName.deleteMany({});
      console.log("templateName collection cleared successfully!");
    } catch (error) {
      console.error(error);
    }
  }
}
