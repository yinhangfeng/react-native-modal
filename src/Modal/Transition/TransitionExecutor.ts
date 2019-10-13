interface TransitionExecutor {
  animatedStyle?: any;
  enter(duration: number): void;
  exit(duration: number): void;
}

export default TransitionExecutor;
