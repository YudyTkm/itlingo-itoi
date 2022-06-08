# Copyright 1999-2022 Gentoo Authors
# Distributed under the terms of the GNU General Public License v2

EAPI=8
USE_RUBY="ruby26 ruby27"

RUBY_FAKEGEM_EXTRADOC="CHANGELOG.md README.md"

RUBY_FAKEGEM_RECIPE_TEST="rspec3"

RUBY_FAKEGEM_GEMSPEC="solargraph.gemspec"

RUBY_FAKEGEM_EXTRAINSTALL="yardoc"

inherit ruby-fakegem

DESCRIPTION="IDE tools for code completion, inline documentation, and static analysis"
HOMEPAGE="https://solargraph.org/"
SRC_URI="https://github.com/castwide/solargraph/archive/refs/tags/v${PV}.tar.gz -> ${P}.tar.gz"
LICENSE="MIT"

KEYWORDS="~amd64"
SLOT="0"
IUSE="doc"

ruby_add_rdepend "
	>=dev-ruby/backport-1.2:0
	dev-ruby/benchmark
	>=dev-ruby/bundler-1.17.2
	>=dev-ruby/diff-lcs-1.4:0
	dev-ruby/e2mmap
	>=dev-ruby/jaro_winkler-1.5:1
	>=dev-ruby/kramdown-2.3:2
	>=dev-ruby/kramdown-parser-gfm-1.1:1
	>=dev-ruby/parser-3.0:0
	=dev-ruby/reverse_markdown-2*
	>=dev-ruby/rubocop-0.52
	dev-ruby/thor:1
	dev-ruby/tilt:2
	>=dev-ruby/yard-0.9.24:0
"

ruby_add_bdepend "test? (
	>=dev-ruby/public_suffix-3.1:3
	>=dev-ruby/webmock-3.6:3
)"

all_ruby_prepare() {
	sed -i -e '/pry/ s:^:#:' ${RUBY_FAKEGEM_GEMSPEC} || die

	sed -e '/bundler/ s:^:#:' \
		-e '/SIMPLECOV/,/end/ s:^:#:' \
		-i spec/spec_helper.rb || die
	rm -f spec/api_map/bundler_methods_spec.rb spec/{documentor,yard_map}_spec.rb|| die

	sed -i -e '/ignores undefined method calls from external sources/askip "Does not work with Gentoo installed package"' spec/type_checker/levels/strict_spec.rb || die
}

each_ruby_test() {
	each_fakegem_test

	# Remove cached gem installs in homedir since they will cause the
	# next run to fail.
	rm -rf "${HOME}/.local/share/gem" || die
}
