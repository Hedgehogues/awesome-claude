# Test: research:triz

## Case: no-problem-statement
stub: fresh-repo
semantic:
  - prompt_for_problem: skill asks for the contradiction/problem to analyze
  - no_arbitrary_output: skill does not generate TRIZ analysis without input

## Case: with-problem-context
stub: with-openspec
semantic:
  - triz_method: output references TRIZ methodology (contradiction, principle, ideal final result)
  - structured_analysis: output contains a structured analysis with discrete steps
