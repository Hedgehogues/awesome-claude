import type { SlideEntry } from '@/types/slide'

import SlidePodlodkaCover, { meta as metaPodlodkaCover } from '@/slides/SlidePodlodkaCover'
import SlideCover, { meta as metaCover } from '@/slides/SlideCover'
import SlideSpeakerIntro, { meta as metaSpeakerIntro } from '@/slides/section1-industry/SlideSpeakerIntro'

import SlideSection1Intro, { meta as metaSection1Intro } from '@/slides/section1-industry/SlideSection1Intro'
import SlideMarketMaturity, { meta as metaMarketMaturity } from '@/slides/section1-industry/SlideMarketMaturity'
import SlideThreeStages, { meta as metaThreeStages } from '@/slides/section1-industry/SlideThreeStages'
import SlideParticipantLevels, { meta as metaParticipantLevels } from '@/slides/section1-industry/SlideParticipantLevels'
import SlideSpeedNumbers, { meta as metaSpeedNumbers } from '@/slides/section1-industry/SlideSpeedNumbers'
import SlideVibeCodingLevels, { meta as metaVibeCodingLevels } from '@/slides/section1-industry/SlideVibeCodingLevels'
import SlideScaleLaw, { meta as metaScaleLaw } from '@/slides/section1-industry/SlideScaleLaw'
import SlideManualSDDProblem, { meta as metaManualSDDProblem } from '@/slides/section1-industry/SlideManualSDDProblem'

import SlideSection2Intro, { meta as metaSection2Intro } from '@/slides/section2-theory/SlideSection2Intro'
import SlideEightStagesOverview, { meta as metaEightStagesOverview } from '@/slides/section2-theory/SlideEightStagesOverview'
import SlideStageDetailEarly, { meta as metaStageDetailEarly } from '@/slides/section2-theory/SlideStageDetailEarly'
import SlideStageDetailCLI, { meta as metaStageDetailCLI } from '@/slides/section2-theory/SlideStageDetailCLI'
import SlideStageDetailOrchestration, { meta as metaStageDetailOrchestration } from '@/slides/section2-theory/SlideStageDetailOrchestration'
import SlideBottleneckShift, { meta as metaBottleneckShift } from '@/slides/section2-theory/SlideBottleneckShift'
import SlideRolesMechanism, { meta as metaRolesMechanism } from '@/slides/section2-theory/SlideRolesMechanism'
import SlideDomainBoundary, { meta as metaDomainBoundary } from '@/slides/section2-theory/SlideDomainBoundary'
import SlideSDDMaturityLevels, { meta as metaSDDMaturityLevels } from '@/slides/section2-theory/SlideSDDMaturityLevels'
import SlideSDDMaturityInfographic, { meta as metaSDDMaturityInfographic } from '@/slides/section2-theory/SlideSDDMaturityInfographic'
import SlideThreePrimitivesIntro, { meta as metaThreePrimitivesIntro } from '@/slides/section2-theory/SlideThreePrimitivesIntro'
import SlideThreePrimitives, { meta as metaThreePrimitives } from '@/slides/section2-theory/SlideThreePrimitives'
import SlideLandscape, { meta as metaLandscape } from '@/slides/section2-theory/SlideLandscape'
import SlideOpenSpecVsSpecKit, { meta as metaOpenSpecVsSpecKit } from '@/slides/section2-theory/SlideOpenSpecVsSpecKit'
import SlideArchRepo, { meta as metaArchRepo } from '@/slides/section2-theory/SlideArchRepo'
import SlideWeaknesses, { meta as metaWeaknesses } from '@/slides/section2-theory/SlideWeaknesses'

import SlideSection3Intro, { meta as metaSection3Intro } from '@/slides/section3-workshop/SlideSection3Intro'
import SlideCLIvsSlash, { meta as metaCLIvsSlash } from '@/slides/section3-workshop/SlideCLIvsSlash'
import SlideCoreCommands, { meta as metaCoreCommands } from '@/slides/section3-workshop/SlideCoreCommands'
import SlideArtifacts, { meta as metaArtifacts } from '@/slides/section3-workshop/SlideArtifacts'
import SlideDeltas, { meta as metaDeltas } from '@/slides/section3-workshop/SlideDeltas'
import SlideWorkshopStart, { meta as metaWorkshopStart } from '@/slides/section3-workshop/SlideWorkshopStart'
import SlideBotQR, { meta as metaBotQR } from '@/slides/section3-workshop/SlideBotQR'
import SlideSummary, { meta as metaSummary } from '@/slides/section3-workshop/SlideSummary'
import SlideOnboarding, { meta as metaOnboarding } from '@/slides/section3-workshop/SlideOnboarding'
import SlideQA, { meta as metaQA } from '@/slides/section3-workshop/SlideQA'

export const slides: SlideEntry[] = [
  { meta: metaPodlodkaCover, Component: SlidePodlodkaCover },
  { meta: metaCover, Component: SlideCover },
  { meta: metaSpeakerIntro, Component: SlideSpeakerIntro },

  { meta: metaSection1Intro, Component: SlideSection1Intro },
  { meta: metaMarketMaturity, Component: SlideMarketMaturity },
  { meta: metaParticipantLevels, Component: SlideParticipantLevels },
  { meta: metaSpeedNumbers, Component: SlideSpeedNumbers },
  { meta: metaManualSDDProblem, Component: SlideManualSDDProblem },
  { meta: metaScaleLaw, Component: SlideScaleLaw },
  { meta: metaThreeStages, Component: SlideThreeStages },

  { meta: metaSection2Intro, Component: SlideSection2Intro },
  { meta: metaVibeCodingLevels, Component: SlideVibeCodingLevels },
  { meta: metaEightStagesOverview, Component: SlideEightStagesOverview },
  { meta: metaStageDetailEarly, Component: SlideStageDetailEarly },
  { meta: metaStageDetailCLI, Component: SlideStageDetailCLI },
  { meta: metaStageDetailOrchestration, Component: SlideStageDetailOrchestration },
  { meta: metaBottleneckShift, Component: SlideBottleneckShift },
  { meta: metaRolesMechanism, Component: SlideRolesMechanism },
  { meta: metaDomainBoundary, Component: SlideDomainBoundary },
  { meta: metaSDDMaturityLevels, Component: SlideSDDMaturityLevels },
  { meta: metaSDDMaturityInfographic, Component: SlideSDDMaturityInfographic },
  { meta: metaThreePrimitivesIntro, Component: SlideThreePrimitivesIntro },
  { meta: metaThreePrimitives, Component: SlideThreePrimitives },
  { meta: metaLandscape, Component: SlideLandscape },
  { meta: metaOpenSpecVsSpecKit, Component: SlideOpenSpecVsSpecKit },
  { meta: metaArchRepo, Component: SlideArchRepo },
  { meta: metaWeaknesses, Component: SlideWeaknesses },

  { meta: metaSection3Intro, Component: SlideSection3Intro },
  { meta: metaCLIvsSlash, Component: SlideCLIvsSlash },
  { meta: metaCoreCommands, Component: SlideCoreCommands },
  { meta: metaArtifacts, Component: SlideArtifacts },
  { meta: metaDeltas, Component: SlideDeltas },
  { meta: metaWorkshopStart, Component: SlideWorkshopStart },
  { meta: metaBotQR, Component: SlideBotQR },
  { meta: metaSummary, Component: SlideSummary },
  { meta: metaOnboarding, Component: SlideOnboarding },
  { meta: metaQA, Component: SlideQA },
]
