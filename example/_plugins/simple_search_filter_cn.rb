module Jekyll
  module CharFilter
    def remove_chars_cn(input)
      input.gsub! '\\','&#92;'
      input.gsub! /\t/, '    '
	  input.gsub! '@',''
	  input.gsub! '$',''
	  input.gsub! '%',''
	  input.gsub! '&',''
	  input.gsub! '"',''
	  input.gsub! '{',''
	  input.gsub! '}',''
	  input
    end
  end
end

Liquid::Template.register_filter(Jekyll::CharFilter)
