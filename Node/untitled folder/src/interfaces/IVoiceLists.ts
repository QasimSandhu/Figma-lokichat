export default interface IVoiceLists extends Document {
    id: string;
    languageCodes: string;
    ssmlGender: string;
    naturalSampleRateHertz: number;
    name: string;
    characterName:string

}