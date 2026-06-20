import type { Story } from "../types";
import { emptyEffects } from "../types";

// Cerita contoh bawaan — bisa dimainkan langsung atau dijadikan acuan menulis.
export const EXAMPLE_STORY: Story = {
  id: "story_contoh",
  title: "Gua Berkabut (contoh)",
  startSceneId: "mulai",
  scenes: {
    mulai: {
      id: "mulai",
      title: "Mulut gua",
      text: "Kau berdiri di mulut sebuah gua gelap. Angin dingin berhembus dari dalam, dan kau dengar tetesan air bergema di kejauhan. Sesuatu menunggumu di sana.",
      effects: emptyEffects(),
      ending: null,
      choices: [
        { id: "c1", text: "Langsung masuk ke gua", goto: "lorong", roll: null },
        { id: "c2", text: "Nyalakan obor lebih dulu", goto: "obor", roll: null },
      ],
    },
    obor: {
      id: "obor",
      title: "Menyalakan obor",
      text: "Cahaya obor menari di dinding berlumut. Sekarang kau bisa melihat dengan jelas. Rasa percaya diri menyelimutimu.",
      effects: { hpChange: 0, itemsGained: ["Obor menyala"], itemsLost: [] },
      ending: null,
      choices: [{ id: "c3", text: "Masuk ke lorong", goto: "lorong", roll: null }],
    },
    lorong: {
      id: "lorong",
      title: "Lorong licin",
      text: "Lorong sempit membentang ke bawah. Lantainya basah dan licin. Satu langkah salah bisa membuatmu terjatuh.",
      effects: emptyEffects(),
      ending: null,
      choices: [
        {
          id: "c4",
          text: "Mengendap hati-hati melewati lantai licin",
          goto: null,
          roll: { stat: "DEX", dc: 13, successSceneId: "harta", failSceneId: "jatuh" },
        },
      ],
    },
    jatuh: {
      id: "jatuh",
      title: "Tergelincir",
      text: "Kakimu tergelincir! Kau jatuh menghantam batu, lututmu berdarah. Tapi kau bangkit dan terus maju.",
      effects: { hpChange: -3, itemsGained: [], itemsLost: [] },
      ending: null,
      choices: [{ id: "c5", text: "Bangkit dan lanjutkan", goto: "harta", roll: null }],
    },
    harta: {
      id: "harta",
      title: "Peti harta",
      text: "Di ujung lorong, sebuah peti tua bersinar redup. Kau membukanya — penuh dengan koin emas! Petualangan ini berakhir dengan kemenangan.",
      effects: { hpChange: 0, itemsGained: ["Sekantung koin emas"], itemsLost: [] },
      ending: "victory",
      choices: [],
    },
  },
};
