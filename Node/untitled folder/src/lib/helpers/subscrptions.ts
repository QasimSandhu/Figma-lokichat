const FREE_WORDS_LIMIT = 10000;
const ALLOWED_WORDS_LIMIT = 300;

const findMatchingPlan = (subscriptionId: string, subscriptions: any[]) => {
  for (const subscription of subscriptions) {
    const matchingPlan = subscription.plans.find(
      (plan: any) => plan?._id?.toString() === subscriptionId?.toString()
    );
    if (matchingPlan) return matchingPlan;
  }
  return null;
};

export const updateUserWordsCounter = async (user: any, response, subscriptions) => {
  let wordCount;
    const characterCount = response.replace(/ /g, "").length;
    wordCount = Math.ceil(characterCount / 7);
    const userWordsCount: any = user?.wordsCount || 0;

    const matchingPlanTitle = findMatchingPlan(user.subscription, subscriptions);
    if (matchingPlanTitle) {
      if (userWordsCount < matchingPlanTitle?.wordsAllowed && matchingPlanTitle?.wordsAllowed < userWordsCount + wordCount) {
        const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount) as number;
        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
      }
    }
    if (!user.subscription) {
      let limit = FREE_WORDS_LIMIT;
      if (userWordsCount < limit && limit < userWordsCount + wordCount) {
        const remainingLimit = (limit - userWordsCount) as number;
        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
      }
    }
    try {
      user.wordsCount = userWordsCount + wordCount;
      await user.save();
    } catch (error) {
      console.error("Error updating wordsCount:", error);
    }
};

export const updateStreamWordsCounter = async (user: any, response, subscriptions) => {
    let wordCount;
      const characterCount = response.replace(/ /g, "").length;
      wordCount = Math.ceil(characterCount / 7);
      const userWordsCount: any = user?.wordsCount || 0;
  
      const matchingPlanTitle = findMatchingPlan(user.subscription, subscriptions);
      if (matchingPlanTitle) {
        if (userWordsCount < matchingPlanTitle?.wordsAllowed && matchingPlanTitle?.wordsAllowed < userWordsCount + wordCount) {
          const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount) as number;
          user.wordsCount = matchingPlanTitle.wordsAllowed;
          // throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        } else {
          user.wordsCount = user.wordsCount + wordCount;
        }
      }
      if (!user.subscription) {
        let limit = FREE_WORDS_LIMIT;
        if (userWordsCount < limit && limit < userWordsCount + wordCount) {
          const remainingLimit = (limit - userWordsCount) as number;
          user.wordsCount = FREE_WORDS_LIMIT;
          // throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        } else {
          user.wordsCount = user.wordsCount + wordCount;
        }
      }
      try {
        // user.wordsCount = userWordsCount + wordCount;
        await user.save();
      } catch (error) {
        console.error("Error updating wordsCount:", error);
      }
}

export const verifyRemainingWords = async (user: any, subscriptions) => {

  const userWordsCount: any = user?.wordsCount || 0;
  const matchingPlanTitle = findMatchingPlan(user.subscription, subscriptions);
  if (matchingPlanTitle) {
    if (userWordsCount >= matchingPlanTitle?.wordsAllowed) {
      throw new Error("limit exceed please buy more words");
    }
    if (
      userWordsCount < matchingPlanTitle?.wordsAllowed &&
      matchingPlanTitle?.wordsAllowed < userWordsCount + ALLOWED_WORDS_LIMIT
    ) {
      const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount) as number;
      throw new Error(`Your remaining limit is ${remainingLimit} words.`);
    }
  }
  if (!user.subscription) {
    let limit = FREE_WORDS_LIMIT;
    if (userWordsCount >= limit) {
      throw new Error("Free limit exceed please buy subscription");
    }
    if (userWordsCount < limit && limit < userWordsCount + ALLOWED_WORDS_LIMIT) {
      const remainingLimit = (limit - userWordsCount) as number;
      throw new Error(`Your remaining limit is ${remainingLimit} words.`);
    }
  }
};