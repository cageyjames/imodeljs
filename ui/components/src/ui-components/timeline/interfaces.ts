/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Timeline
 */

import { ColorDef } from "@bentley/imodeljs-common";
import { ScreenViewport } from "@bentley/imodeljs-frontend";

/**
 * A range of time which can be used to focus in on activities scheduled around a milestone.
 * @alpha
 */
export interface MilestoneRange {
  start: Date;
  end: Date;
}

/**
 * A Milestone event that is to be noted in the timeline.
 * @alpha
 */
export interface Milestone {
  /** uniqueId of milestone */
  id: string;
  /** milestone date */
  date: Date;
  parentId?: string;
  /** Milestone label that is display if space allows */
  label?: string;
  /** Milestone description that is show as tooltip */
  description?: string;
  /** animation range that includes milestone */
  range?: MilestoneRange;
  /** Set to true if read only. */ // TODO can range be modified if read only?
  readonly?: boolean;
  children?: Milestone[];
}

/** The amount of detail to be displayed in timeline.
 * @alpha
 */

/** The timeline scale.
 * @alpha
 */
export enum TimelineScale {
  /** Show years */
  Years,
  /** Show quarters */
  Quarters,
  /** Show months */
  Months,
  /** Show days */
  Days,
  /** Show hours */
  Hours,
}

/** Determines if data displayed to use is the actual date or the amount of time elapsed since project start.
 * @alpha
 */
export enum TimelineDateDisplay {
  /** Display time axis using actual start/end dates */
  ActualTime,
  /** Display time axis using time relative to actual start/end dates */
  ProjectTime,
}

/**
 * Playback Settings.
 * @alpha TODO: do we need a display StartDate/EndData this would allow user to show a timeline that extends beyond the 'start' and 'end' dates.
 */
export interface PlaybackSettings {
  /** time in milliseconds to play animation from start date to end date */
  duration?: number;
  /** Set to True if animation to restart each time playbackEnd is reached. Defaults to false. */
  loop?: boolean;
  /** If true a minimal set of data is displayed. */
  minimized?: boolean;
  /** Playback start. If defined must be within start-end range. If not define 'start' is used. */
  playbackStart?: Date;
  /** Playback end. If defined must be within start-end range and later than playbackStart. If not define 'end' is used. */
  playbackEnd?: Date;
  /** Set to True if user should be allowed to insert milestone dates. Defaults to false */
  allowMilestoneEdits?: boolean;
  /** Define if actual date/times are used or date/times relative to project are used to draw timeline axis. */
  dateDisplay?: TimelineDateDisplay;
}

/**
 * An interface used to notify Handlers of the current pointer position in the timeline playback. Valid range is 0 to 1 and it determines percentage complete.
 * @alpha
 */
export type AnimationFractionChangeHandler = (animationFraction: number) => void;

/**
 * An interface used to notify Handlers of Playback Settings changes.
 * Contains the settings to be used.
 * @alpha
 */
export type PlaybackSettingsChangeHandler = (settingsChange: PlaybackSettings) => void;

/** Interface for a timeline data provider class
 * @alpha
 */
export interface TimelineDataProvider {
  /** uniqueId of provider */
  id: string;
  /** view id when viewport is initially assigned */
  viewId: string;
  /** returns true if the provider has timeline animation data available */
  supportsTimelineAnimation: boolean;
  /** Starting date for entire timeline */
  start?: Date;
  /** End date for entire timeline */
  end?: Date;
  /** Current animation fraction from 0.0 to 1.0 */
  animationFraction?: number;
  /** Get count of milestones. If parent milestone is not defined then the number of root milestones will be returned. */
  getMilestonesCount(parent?: Milestone): number;
  /** Get array of milestones. If parent milestone is not defined then the root milestones will be returned. */
  getMilestones(parent?: Milestone): Milestone[];
  /** Called to get the playback settings. */
  getSettings(): PlaybackSettings;
  /** Called to get the initial scrubber location. This must be a value between 0 and the duration in PlaybackSettings. */
  initialDuration: number;
  /** Called to get the duration of the Playback. */
  duration: number;
  /** If true the playback will continuously loop. */
  loop: boolean;
  /** Called to save the playback settings */
  updateSettings(settings: PlaybackSettings): void;
  /** Async call to load milestone and settings data */
  loadTimelineData(): Promise<boolean>;
  /** Called when an internal process has defined the playback settings and the UI needs to be updated */
  onPlaybackSettingChanged?: PlaybackSettingsChangeHandler;
  /** Called when the an internal process has defined the playback settings and the UI needs to be updated */
  onAnimationFractionChanged?: AnimationFractionChangeHandler;
  /** viewport to show animation */
  viewport?: ScreenViewport;
}

/**
 * An interface used to notify Handlers of Playback progress.
 * Contains the settings to be used.
 * @alpha
 */
export type SolarPlaybackProgressHandler = (time: Date) => void;

/** Data Provider interface for getting and setting solar position
 * @alpha
 */
export interface SolarDataProvider {
  // View Id used to determine sunrise and sunset
  viewId: string;
  /** returns true if the provider has timeline animation data available */
  supportsTimelineAnimation: boolean;
  // set to true is timeline should be shown - return false if view is not set to display shadow.
  readonly shouldShowTimeline: boolean;
  /** Starting date for entire timeline */
  day: Date;
  /** Starting time for day in milliseconds */
  readonly dayStartMs: number;
  /** Time of day for sun */
  timeOfDay: Date;
  /** Called during playback to update animation */
  onTimeChanged?: SolarPlaybackProgressHandler;
  /** viewport to show animation */
  viewport?: ScreenViewport;
  /** Time of Sunrise to nearest minute */
  readonly sunrise: Date;
  /** time of Sunrise to nearest minute */
  readonly sunset: Date;
  /** shadow color */
  shadowColor: ColorDef;
}
