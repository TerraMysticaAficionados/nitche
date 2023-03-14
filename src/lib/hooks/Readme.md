## lib/hooks

hooks should be colocated with any data if possible, however certain hooks are decoupled from all data. These can be included in this folder. Exceptions to these rules should have a reason that tops "when working with a piece of data it is useful to have accessors to that data close at hand so I shold co-locate this hook with its data" or "this hook has no logical data or components to colocate with, so I will include it in generic hooks folder".

Source for some, could import this but no need.
https://usehooks-ts.com/

