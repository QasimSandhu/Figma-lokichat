export const getPlainTextFromHTML = (content: any) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.replace(/\s+/g, " ").trim();
  };
  
  export const getPlainTextFromMarkdown = (content = "") => {
    // Remove emphasis (bold and italic)
    let plainText = content.replace(/(\*\*|__)(.*?)\1/g, "$2");
    plainText = plainText.replace(/(\*|_)(.*?)\1/g, "$2");
    // plainText = plainText.replace(/={2,}/g, ' ');
  
    // Remove headers
    plainText = plainText.replace(/#{1,6}\s/g, "");
  
    // Remove lists and bullets
    plainText = plainText.replace(/(\d+\.|\*|-)\s/g, "");
  
    // Remove links
    plainText = plainText.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  
    // Remove inline code
    plainText = plainText.replace(/`([^`]+)`/g, "$1");
  
    // Remove block code
    plainText = plainText.replace(/```([\s\S]*?)```/g, "");
  
    // Remove horizontal rules
    plainText = plainText.replace(/(\*\*\*|---|\*\*\*)/g, "");
  
    // Remove lines composed of equal signs, dashes, or asterisks
    plainText = plainText.replace(/^[=\-*]+\s*$/gm, "");
  
    // Remove other HTML tags
    plainText = plainText.replace(/<[^>]*>/g, "");
  
    // Replace consecutive spaces with a single space and trim
    return plainText.replace(/\s+/g, " ").trim();
  };

  export const removeMarkdownHorizontalRules = (content = "") => {
    return content.replace(/^[=\-*]+\s*$/gm, "");
  };