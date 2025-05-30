import { Button } from "../../ui/button.tsx";
import { ReactNode } from "react";
import { CardPreviewStory } from "./card-preview-story.tsx";
import { SelectStory } from "./select-story.tsx";
import { PieChartCanvasStory } from "./pie-chart-canvas-story.tsx";
import { SnackbarStory } from "./snackbar-story.tsx";
import { ListStory } from "./list-story.tsx";
import { ListStoryMultipleIcons } from "./list-story-multiple-icons.tsx";
import { RadioListStory } from "./radio-list-story.tsx";
import { BottomSheetStory } from "./bottom-sheet-story.tsx";
import { AiSpeechPreview } from "../shared/feature-preview/ai-speech-preview.tsx";
import { DeckCardDbType } from "api";

export type Component = {
  name: string;
  component: ReactNode;
};

export const components: Array<Component> = [
  {
    name: "Button",
    component: <Button>Button</Button>,
  },
  {
    name: "Button - disabled",
    component: <Button disabled>Button</Button>,
  },
  {
    name: "Button - outline",
    component: <Button outline>Button</Button>,
  },
  {
    name: "Card preview - normal",
    component: (
      <CardPreviewStory
        card={
          {
            example: "Example",
            back: "Back",
            front: "Front",
          } as DeckCardDbType
        }
      />
    ),
  },
  {
    name: "Card preview - big text",
    component: (
      <CardPreviewStory
        card={
          {
            example: "Example",
            front: "Front",
            // eslint-disable-next-line
            back: `<ul><li>﻿﻿FAS-Risiko</li><li>﻿﻿viele Eltern meiden den Kontakt zum Hilfesystem</li><li>﻿﻿keine verlässliche Bezugsperson/häufiger Wechsel</li><li>﻿﻿Erleben von Armut/Arbeitslosigkeit/beengten Wohnverhältnissen</li><li>﻿﻿desolater elterlicher Gesundheitszustand/Notfälle/Sorge um die Eltern</li><li>﻿﻿Gefährdung durch elterliche Intoxikation (direkte Gewalterfahrung oder Zeugenschaft)</li><li>﻿﻿Familienklima: Familiengeheimnisse, Tabuisierungen, Loyalitätskon-flikte</li><li>﻿﻿kindliche Verhaltensauffälligkeiten (Hyperaktivität, Angste, Rückzug, extrem schüchtern)</li><li>﻿﻿typische Rollen und Familienregeln (Umkreisen und Verschweigen des Alkoholthemas)</li><li>﻿﻿Familienstruktur: aufgeweichte Generationsgrenzen, altersunangemes-sene Aufgaben,</li><li>﻿﻿erhöhte Gefahr emotionalen/sexuellen Mißbrauchs</li></ul><p>grundlegende Stressoren:</p><ul><li>﻿﻿elterliche Unzuverlässigkeit</li><li>﻿﻿Bindungsstörungen: unsicher, ambivalent</li><li>﻿﻿Duldungs- und Katastrophenstress</li><li>﻿﻿Krisenstress (bei Unfähigkeit zur Problembewältigung)</li><li>﻿﻿überfordernde Aufgaben und Rollen</li></ul><p>Quelle: GVS (2012, 2014)</p>`,
          } as DeckCardDbType
        }
      />
    ),
  },
  {
    name: SelectStory.name,
    component: <SelectStory />,
  },
  {
    name: PieChartCanvasStory.name,
    component: <PieChartCanvasStory />,
  },
  {
    name: SnackbarStory.name,
    component: <SnackbarStory />,
  },
  {
    name: ListStory.name,
    component: <ListStory />,
  },
  {
    name: ListStoryMultipleIcons.name,
    component: <ListStoryMultipleIcons />,
  },
  {
    name: RadioListStory.name,
    component: <RadioListStory />,
  },
  {
    name: BottomSheetStory.name,
    component: <BottomSheetStory />,
  },
  {
    name: "AISpeech",
    component: <AiSpeechPreview isOpen={true} onClose={() => {}} />,
  },
];
